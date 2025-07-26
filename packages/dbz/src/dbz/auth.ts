/* eslint-disable no-restricted-properties */
import { execAsync } from '@goatjs/node/exec';
import { spawn } from 'node:child_process';

export const spawnWithNpmToken = async (command: string, args: string[] = []) => {
  const token = await getAccessToken();

  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      env: {
        ...process.env,
        YARN_NPM_AUTH_TOKEN: token,
      },
      stdio: 'inherit',
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code?.toString() ?? ''}`));
      }
    });

    child.on('error', reject);
  });
};

export const execWithNpmtoken = async (command: string) => {
  return execAsync(command, { env: { ...process.env, YARN_NPM_AUTH_TOKEN: await getAccessToken() } });
};

export const getAccessToken = async () => {
  const { stdout } = await execAsync('gcloud auth print-access-token');
  return stdout.trim();
};
