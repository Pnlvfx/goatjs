import { spawn } from 'node:child_process';
import os from 'node:os';

const platform = os.platform();

export const spawnWithLog = (command: string, args: string[] = []) => {
  return new Promise<string>((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', shell: platform === 'win32' });
    child.on('error', reject);

    let out = '';
    let error = '';

    child.stdout?.on('data', (data: Buffer) => {
      out += data.toString();
    });

    child.stderr?.on('data', (data: Buffer) => {
      error += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(out);
      } else {
        const parts = [`command ${command} failed`, error || out, code ? `with code ${code.toString()}` : ''];
        reject(new Error(parts.join(' ')));
      }
    });
  });
};
