import { consoleColor } from '@goatjs/node/console-color';
import { loadConfigFile } from '../config.ts';
import { createSshClient } from '../ssh.ts';

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
