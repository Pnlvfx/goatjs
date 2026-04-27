import { spawn } from 'cross-spawn';
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
import { nginx } from './internal-plugins/nginx.ts';
import { pm2 } from './internal-plugins/pm2.ts';
import { certbot } from './internal-plugins/certbot.ts';
import { runPlugin } from './run-plugin.ts';
import { corepack } from './internal-plugins/corepack.ts';

export const connectToVps = async () => {
  const { host } = await loadConfigFile();

  await new Promise<void>((resolve, reject) => {
    const proc = spawn('ssh', [`root@${host}`], { stdio: 'inherit' });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`SSH exited with code ${code?.toString() ?? 'null'}`));
    });
    proc.on('error', reject);
  });
};

export const runPluginByName = async (name: string) => {
  const { host, projectName, plugins = [], gcpCredentialsPath, nginx: nginxConfig } = await loadConfigFile();

  const plugin = plugins.find((p) => p.name === name);
  if (!plugin) throw new Error(`Plugin "${name}" not found. Available: ${plugins.map((p) => p.name).join(', ') || 'none'}`);

  const ssh = await createSshClient({ host });
  const ctx = { ssh, projectName, host, gcpCredentialsPath, nginx: nginxConfig };

  try {
    await runPlugin(plugin.name, plugin, ctx);
  } finally {
    ssh.dispose();
  }
};

export const restartVps = async () => {
  const { host } = await loadConfigFile();
  const ssh = await createSshClient({ host });

  try {
    await ssh.execCommand('sudo reboot');
    consoleColor('blue', 'restarted');
  } finally {
    ssh.dispose();
  }
};

export interface DeployParams {
  init?: boolean;
  update?: boolean;
}

export const deployToVps = async ({ init, update }: DeployParams) => {
  const { host, projectName, plugins = [], gcpCredentialsPath, nginx: nginxConfig } = await loadConfigFile();
  const git = createGitClient();
  await checkGitStatus();

  const reset = async () => {
    await git.checkout('.yarnrc.yml package.json');
    await spawnWithLog('yarn');
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

      for (const plugin of plugins) {
        await runPlugin(plugin.name, plugin, ctx);
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
      await certbot(ctx);
      await ssh.execCommand('sudo reboot');
    } else {
      await ssh.execCommand('pm2 restart api', { cwd: projectName });
    }

    ssh.dispose();
    await reset();

    await spawnWithLog('yarn', ['version', 'minor']);

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
