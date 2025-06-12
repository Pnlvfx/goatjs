/* eslint-disable no-console */
import { spawn } from 'node:child_process';
import { platform } from 'node:os';

// try to move into his own package so we can use it here too.

const isWindows = platform() === 'win32';

export const updateLocalDeps = (packages: Record<string, string>) => {
  return new Promise<void>((resolve, reject) => {
    const deps = [];
    for (const [key, value] of Object.entries(packages)) {
      deps.push(`${key}@${value}`);
    }
    // eslint-disable-next-line sonarjs/no-os-command-from-path
    const child = spawn('yarn', ['up', deps.join(' ')], { shell: isWindows });

    child.on('error', reject);

    let error = '';

    child.stderr.on('data', (chunk: Buffer) => {
      const err = chunk.toString();
      console.log(err);
      error += err;
    });

    child.stdout.on('data', (chunk: Buffer) => {
      console.log(chunk.toString());
    });

    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Update failed with code: ${code?.toString() ?? ''} because of: ${error}`));
    });
  });
};
