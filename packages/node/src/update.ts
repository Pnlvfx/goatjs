/* eslint-disable no-console */
import { spawn } from 'node:child_process';
import { platform } from 'node:os';

// try to move into his own package so we can use it here too.

const isWindows = platform() === 'win32';

export const updateLocalDeps = (packages: string[]) => {
  return new Promise<void>((resolve, reject) => {
    // eslint-disable-next-line sonarjs/no-os-command-from-path
    const child = spawn('yarn', ['up', packages.join(' ')], { shell: isWindows });

    child.on('error', reject);

    child.stderr.on('data', (chunk: Buffer) => {
      console.log(chunk);
    });

    child.stdout.on('data', (chunk: Buffer) => {
      console.log(chunk);
    });

    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error('Update failed'));
    });
  });
};
