import type { PluginContext } from '../types/plugin.ts';

export const tor = async ({ ssh }: PluginContext) => {
  await ssh.execCommand('sudo apt install -y tor');
};
