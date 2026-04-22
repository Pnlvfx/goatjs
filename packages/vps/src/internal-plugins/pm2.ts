import type { PluginContext } from '../plugin.ts';

export const pm2 = async ({ ssh }: PluginContext) => {
  await ssh.execCommand('sudo npm i -g pm2');
  await ssh.execCommand('pm2 startup');
  await ssh.execCommand('systemctl enable pm2-root');
};
