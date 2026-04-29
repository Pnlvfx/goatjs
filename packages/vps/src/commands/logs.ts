import { consoleColor } from '@goatjs/node/console-color';
import { loadConfigFile } from '../config.ts';
import { createSshClient } from '../ssh.ts';

export const vpsLogs = async () => {
  const { host } = await loadConfigFile();
  const ssh = await createSshClient({ host });

  try {
    const { stdout, stderr } = await ssh.execCommand('pm2 logs --nostream');
    if (stderr) {
      consoleColor('red', stderr);
    } else {
      consoleColor('blue', stdout);
    }
  } finally {
    ssh.dispose();
  }
};
