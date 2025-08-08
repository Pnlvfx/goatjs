import { spawn } from 'node:child_process';
import os from 'node:os';

const platform = os.platform();

export const spawnStdio = (command: string, args: string[]) => {
  command = platform === 'win32' && !command.endsWith('.cmd') ? `${command}.cmd` : command;
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error('Spawned process failed'));
    });
  });
};
