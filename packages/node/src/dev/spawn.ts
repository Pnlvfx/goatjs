import type { ExecaOptions, ExecaProcess } from '../execa.js';
import { spawn } from 'node:child_process';
import os from 'node:os';

const platform = os.platform();

export const spawnWithLog = (command: string, args: string[] = [], { cwd }: ExecaOptions) => {
  return new Promise<ExecaProcess>((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit', shell: platform === 'win32', cwd });
    child.on('error', reject);

    let stderr = '';
    let stdout = '';

    child.stderr?.on('data', (data: Buffer) => {
      stderr += data.toString();
    });

    child.stdout?.on('data', (data: Buffer) => {
      stdout += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stderr, stdout });
      } else {
        const parts = [`command ${command} failed`, stderr || stdout, code ? `with code ${code.toString()}` : ''];
        reject(new Error(parts.filter(Boolean).join(' ')));
      }
    });
  });
};
