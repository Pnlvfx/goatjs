import type { PluginContext } from '../plugin.ts';

export const nano = async ({ ssh }: PluginContext) => {
  await ssh.execCommand('sudo apt install -y nano');
};
