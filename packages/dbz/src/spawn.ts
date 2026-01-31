import { isProduction } from '@goatjs/node/prod';
import { spawn } from 'cross-spawn';

export interface ExecaProcess {
  stderr: string;
  stdout: string;
}

export interface ExecaOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
}

export const spawnWithLog = (command: string, args: string[] = [], { cwd, env }: ExecaOptions = {}) => {
  return new Promise<ExecaProcess>((resolve, reject) => {
    const child = spawn(command, args, { stdio: isProduction ? undefined : 'inherit', cwd, env });
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
