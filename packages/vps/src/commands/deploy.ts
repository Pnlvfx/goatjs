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
import { backupCurrentRelease, restoreRelease, pruneOldReleases } from '../release.ts';
import * as z from 'zod';
import { setTimeout } from 'node:timers/promises';

const PM2_HEALTH_DELAY_MS = 5000;

// eslint-disable-next-line no-restricted-properties
const pm2JlistSchema = z.object({ name: z.string(), pm2_env: z.object({ status: z.literal(['online']) }) });

export interface DeployParams {
  init?: boolean;
  update?: boolean;
}

export const deployToVps = async ({ init, update }: DeployParams) => {
  const { host, projectName, plugins = {}, gcpCredentialsPath, nginx: nginxConfig } = await loadConfigFile();
  const git = createGitClient();
  await checkGitStatus();
  await rimraf('dist');
  await execa('yarn', ['build'], { stdio: 'inherit' });

  const reset = async () => {
    await git.checkout('.yarnrc.yml package.json');
    await execa('yarn', { stdio: 'inherit' });
  };

  const ssh = await createSshClient({ host });
  const ctx = { ssh, projectName, host, gcpCredentialsPath, nginx: nginxConfig };
  const projectDir = `/root/${projectName}`;

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

    const backupTimestamp = init ? undefined : await backupCurrentRelease(ssh, projectName);
    const localZipPath = await zipServer(projectName);
    const vpsZipPath = `/root/${projectName}.zip`;

    await ssh.putFile(localZipPath, vpsZipPath);
    await ssh.execCommand(`rm -rf ${projectDir}`);
    await ssh.execCommand(`unzip -o ${vpsZipPath} -d ${projectDir}`);
    await ssh.execCommand(`rm ${vpsZipPath}`);
    await ssh.execCommand('yarn workspaces focus --production', { cwd: projectDir });
    await ssh.execCommand('yarn dedupe', { cwd: projectDir });

    if (init) {
      await ssh.execCommand('pm2 start --name api npm -- start', { cwd: projectDir });
      await ssh.execCommand('pm2 save');
      await certbot(ctx);
      await ssh.execCommand('sudo reboot');
    } else {
      const checkPm2Health = async () => {
        await setTimeout(PM2_HEALTH_DELAY_MS);
        const { stdout: json } = await ssh.execCommand('pm2 jlist');
        const processes = await pm2JlistSchema.array().parseAsync(JSON.parse(json));
        const api = processes.find((p) => p.name === 'api');
        return api?.pm2_env.status ?? 'unknown';
      };

      await ssh.execCommand('pm2 restart api');
      const status = await checkPm2Health();
      if (status !== 'online') {
        consoleColor('red', `pm2 status is ${JSON.stringify(status)} - rolling back`);
        if (backupTimestamp) {
          await restoreRelease(ssh, projectName, backupTimestamp);
          await ssh.execCommand('pm2 restart api');
        }
        throw new Error(`deploy failed: app status was ${status}, rolled back to previous release`);
      }
      await pruneOldReleases(ssh, projectName);
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
