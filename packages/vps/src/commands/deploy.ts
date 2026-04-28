import { createGitClient } from '@goatjs/node/git';
import { loadConfigFile } from '../config.ts';
import { checkGitStatus } from '@goatjs/dbz/git';
import { rimraf } from '@goatjs/rimraf';
import { execa } from 'execa';
import { createSshClient } from '../ssh.ts';
import { updateSystem } from '../internal-plugins/update.ts';
import { input } from '@goatjs/node/input';
import { node } from '../internal-plugins/node.ts';
import { nano } from '../internal-plugins/nano.ts';
import { gcloud } from '../internal-plugins/gcloud.ts';
import { nginx } from '../internal-plugins/nginx.ts';
import { pm2 } from '../internal-plugins/pm2.ts';
import { corepack } from '../internal-plugins/corepack.ts';
import { runPlugin } from '../run-plugin.ts';
import { getEntries } from '@goatjs/core/object';
import { zipServer } from '../zip.ts';
import { certbot } from '../internal-plugins/certbot.ts';
import { consoleColor } from '@goatjs/node/console-color';
import { unzip } from '../internal-plugins/unzip.ts';

export interface DeployParams {
  init?: boolean;
  update?: boolean;
}

export const deployToVps = async ({ init, update }: DeployParams) => {
  const { host, projectName, plugins = {}, gcpCredentialsPath, nginx: nginxConfig } = await loadConfigFile();
  const git = createGitClient();
  await checkGitStatus();
  // run this before so if they fail we don't even connect to the vps
  await rimraf('dist');
  await execa('yarn', ['build'], { stdio: 'inherit' });

  const reset = async () => {
    await git.checkout('.yarnrc.yml package.json');
    await execa('yarn', { stdio: 'inherit' });
  };

  const ssh = await createSshClient({ host });
  const ctx = { ssh, projectName, host, gcpCredentialsPath, nginx: nginxConfig };

  try {
    if (init || update) {
      await updateSystem(ssh);
    }

    if (init) {
      await input.create({ title: 'Are you sure that you want to init? It should be used only the first time.' });

      const requiredPlugins = [node, nano, unzip, gcloud, nginx, pm2, corepack];

      for (const plugin of requiredPlugins) {
        await runPlugin(plugin.name, plugin, ctx);
      }

      for (const [name, plugin] of getEntries(plugins)) {
        await runPlugin(name, plugin, ctx);
      }
    }

    const localZipServer = await zipServer(projectName);
    const vpsZipServer = `/root/${projectName}.zip`;

    await ssh.putFile(localZipServer, vpsZipServer);
    await ssh.execCommand(`unzip -o ${vpsZipServer} -d ${projectName}`);
    await ssh.execCommand(`rm ${vpsZipServer}`);
    await ssh.execCommand('yarn workspaces focus --production', { cwd: projectName });
    await ssh.execCommand('yarn dedupe', { cwd: projectName });

    if (init) {
      await ssh.execCommand('pm2 start --name "api" npm -- start', { cwd: projectName });
      await ssh.execCommand('pm2 save');
      await certbot(ctx);
      await ssh.execCommand('sudo reboot');
    } else {
      await ssh.execCommand('pm2 restart api', { cwd: projectName });
    }

    ssh.dispose();
    await reset();

    await execa('yarn', ['version', 'minor'], { stdio: 'inherit' });

    await git.add();
    await git.commit('RELEASE');
    await git.push();

    consoleColor('blue', 'done');
  } catch (err) {
    await reset();
    ssh.dispose();
    throw err;
  }
};
