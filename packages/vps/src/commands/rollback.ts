import { consoleColor } from '@goatjs/node/console-color';
import { loadConfigFile } from '../config.ts';
import { createSshClient } from '../ssh.ts';
import { getLatestRelease, restoreRelease } from '../release.ts';

export const rollbackVps = async () => {
  const { host, projectName } = await loadConfigFile();
  const ssh = await createSshClient({ host });

  try {
    const release = await getLatestRelease(ssh, projectName);
    if (!release) {
      consoleColor('red', 'no releases found to roll back to');
      return;
    }

    consoleColor('blue', `rolling back to release ${release}`);
    await restoreRelease(ssh, projectName, release);
    await ssh.execCommand('pm2 restart api');
    consoleColor('blue', 'rollback done');
  } finally {
    ssh.dispose();
  }
};
