import type { PluginContext } from '../plugin.ts';

export const corepack = async ({ ssh, projectName }: PluginContext) => {
  await ssh.execCommand('sudo npm install -g corepack', { cwd: projectName });
  await ssh.execCommand('corepack enable', { cwd: projectName });
};
