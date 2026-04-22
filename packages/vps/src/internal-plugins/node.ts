import type { PluginContext } from '../plugin.ts';

export const node = async ({ ssh }: PluginContext) => {
  await ssh.execCommand('curl -sL https://deb.nodesource.com/setup_25.x -o /tmp/nodesource_setup.sh');
  await ssh.execCommand('sudo bash /tmp/nodesource_setup.sh');
  await ssh.execCommand('sudo apt install -y nodejs');
};
