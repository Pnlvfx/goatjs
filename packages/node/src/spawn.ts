import { spawn } from 'node:child_process';
import os from 'node:os';

const platform = os.platform();

export const spawnWithLog = (command: string, args: string[]) => {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', shell: platform === 'win32' });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error('Spawned process failed'));
    });
  });
};
