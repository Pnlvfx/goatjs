import { spawn } from 'node:child_process';

export const spawnStdio = (command: string, args: string[]) => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('error', reject);
    child.on('close', resolve);
  });
};
