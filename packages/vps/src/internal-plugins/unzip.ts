import type { PluginContext } from '../plugin.ts';

export const unzip = async ({ ssh }: PluginContext) => {
  await ssh.execCommand('sudo apt install -y unzip');
};
