import type { PluginContext } from '../plugin.ts';

export const certbot = async ({ ssh, nginx: { serverName } }: PluginContext) => {
  await ssh.execCommand('sudo snap install certbot --classic');
  await ssh.execCommand(`sudo certbot --nginx -d ${serverName}`);
};
