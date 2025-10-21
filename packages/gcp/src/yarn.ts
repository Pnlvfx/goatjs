import { execAsync } from '@goatjs/node/exec';
import fs from 'node:fs/promises';
import { platform } from 'node:os';

export const createYarnEnv = async () => {
  await fs.writeFile('.env.yarn', `YARN_NPM_AUTH_TOKEN = ${await getAccessToken()}`);
};

export const auth = async () => {
  const token = await getAccessToken();
  await (platform() === 'win32' ? execAsync(`set YARN_NPM_AUTH_TOKEN=${token}`) : execAsync(`export YARN_NPM_AUTH_TOKEN="${token}"`));
};

export const getAccessToken = async () => {
  const { stdout } = await execAsync('gcloud auth print-access-token');
  return stdout.trim();
};
