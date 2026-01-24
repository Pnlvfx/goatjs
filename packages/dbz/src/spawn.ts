import type { ExecaOptions, ExecaProcess } from '@goatjs/node/execa';
import { isProduction } from '@goatjs/node/prod';
import { spawn } from 'node:child_process';
import os from 'node:os';

const platform = os.platform();

export const spawnWithLog = (command: string, args: string[] = [], { cwd, env }: ExecaOptions = {}) => {
  return new Promise<ExecaProcess>((resolve, reject) => {
    const isWin = platform === 'win32';
    const safe = command.startsWith('"') || command.startsWith("'");
    const child = spawn(isWin && !safe ? `"${command}"` : command, args, { stdio: isProduction ? undefined : 'inherit', shell: isWin, cwd, env });
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
        const parts = [`command ${command} ${args.join(' ')} failed`, stderr || stdout, code === null ? '' : `with code ${code.toString()}`];
        reject(new Error(parts.filter(Boolean).join(' ')));
      }
    });
  });
};
