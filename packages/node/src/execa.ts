import { spawn } from 'node:child_process';
import os from 'node:os';

export interface ExecaProcess {
  stderr: string;
  stdout: string;
}

export interface ExecaOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
}

const platform = os.platform();

export const execa = async (command: string, args: string[] = [], { cwd, env }: ExecaOptions = {}) => {
  return new Promise<ExecaProcess>((resolve, reject) => {
    const child = spawn(command, args, { cwd, shell: platform === 'win32', env });

    child.on('error', reject);

    let stderr = '';
    let stdout = '';

    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });

    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
    });

    child.on('close', (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(stderr));
    });
  });
};
