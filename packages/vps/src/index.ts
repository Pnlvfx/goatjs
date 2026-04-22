import { checkGitStatus } from '@goatjs/dbz/git';
import { spawnWithLog } from '@goatjs/dbz/spawn';
import { createGitClient } from '@goatjs/node/git';
import { input } from '@goatjs/node/input';
import { createSshClient } from './ssh.ts';
import { rimraf } from '@goatjs/rimraf';
import { zipServer } from './zip.ts';
import { consoleColor } from '@goatjs/node/console-color';
import { updateSystem } from './internal-plugins/update.ts';
import { node } from './internal-plugins/node.ts';
import { nano } from './internal-plugins/nano.ts';
import { unzip } from './internal-plugins/unzip.ts';
import { loadConfigFile } from './config.ts';
import { gcloud } from './internal-plugins/gcloud.ts';

export interface DeployParams {
  skipGit?: boolean;
  init?: boolean;
  update?: boolean;
}

export const deployToVps = async ({ skipGit, init, update }: DeployParams) => {
  const { host, projectName, plugins = [], gcpCredentialsPath } = await loadConfigFile();
  const git = createGitClient();
  const ssh = await createSshClient({ host });

  const reset = async () => {
    await git.checkout('.yarnrc.yml package.json');
    await spawnWithLog('yarn'); // predeploy remove some packages and we have to add them back
  };

  try {
    // eslint-disable-next-line unicorn/prefer-ternary
    if (skipGit) {
      await input.create({ title: 'Are you sure you want to release without git?' });
    } else {
      await checkGitStatus();
    }

    if (init || update) {
      await updateSystem(ssh);
    }

    if (init) {
      await input.create({ title: 'Are you sure that you want to init? It should be used only the first time.' });

      const requiredPlugins = [node, nano, unzip, gcloud];

      for (const plugin of requiredPlugins) {
        await plugin({ ssh, projectName, host, gcpCredentialsPath });
      }

      for (const plugin of plugins) {
        await plugin({ ssh, projectName, host, gcpCredentialsPath });
      }
    }

    await rimraf('dist');
    await spawnWithLog('yarn', ['build']);
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
      await ssh.execCommand('sudo reboot');
    } else {
      await ssh.execCommand('pm2 restart api', { cwd: projectName });
    }

    ssh.dispose();
    await reset();

    await spawnWithLog('yarn', ['version', 'minor']);

    if (!skipGit) {
      await git.add();
      await git.commit('RELEASE');
      await git.push();
    }

    consoleColor('blue', 'done');
  } catch (err) {
    await reset();
    ssh.dispose();
    throw err;
  }
};
