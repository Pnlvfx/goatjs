import { spawn } from 'node:child_process';

export const execa = async (command: string, args: string[] = [], { cwd }: { cwd?: string } = {}) => {
  return new Promise<string>((resolve, reject) => {
    const child = spawn(command, args, { cwd });

    child.on('error', reject);

    let error = '';
    let output = '';

    child.stderr.on('data', (chunk: Buffer) => {
      error += chunk.toString();
    });

    child.stdout.on('data', (chunk: Buffer) => {
      output += chunk.toString();
    });

    child.on('close', (code) => {
      if (code === 0) resolve(output);
      else reject(new Error(error));
    });
  });
};
