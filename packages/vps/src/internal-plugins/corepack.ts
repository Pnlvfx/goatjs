import type { PluginContext } from '../types/plugin.ts';

export const corepack = async ({ ssh }: PluginContext) => {
  await ssh.execCommand('sudo npm install -g corepack');
  await ssh.execCommand('corepack enable');
};
