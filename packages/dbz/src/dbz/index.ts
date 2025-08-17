import { consoleColor } from '@goatjs/node/console-color';
import { git } from '@goatjs/node/git/git';
import { checkGitStatus, getAccessToken, isMonorepo } from './helpers.js';
import { publish, type PublishOptions } from './publish.js';
import { execAsync } from '@goatjs/node/exec';
import { platform } from 'node:os';
import fs from 'node:fs/promises';
import { spawnWithLog } from '@goatjs/node/spawn';

interface DbzPublishOptions extends PublishOptions {
  provider?: 'gcp' | 'verdaccio';
}

export const dbz = {
  config: {
    set: async (name: string, value: string) => spawnWithLog('yarn', ['config', 'set', name, value]),
  },
  createYarnEnv: async () => {
    await fs.writeFile('.env.yarn', `YARN_NPM_AUTH_TOKEN = ${await getAccessToken()}`);
  },
  auth: async (): Promise<void> => {
    const token = await getAccessToken();
    await (platform() === 'win32' ? execAsync(`set YARN_NPM_AUTH_TOKEN=${token}`) : execAsync(`export YARN_NPM_AUTH_TOKEN="${token}"`));
  },
  publish: async ({ version }: DbzPublishOptions = {}) => {
    await checkGitStatus();
    const monorepo = await isMonorepo();
    if (monorepo) {
      consoleColor('yellow', "dbz detect that you're running in a monorepo. Please ensure to run this scripts from the root.");
      await spawnWithLog('yarn', ['build']);
    }
    await publish({ version, monorepo });
    await git.add();
    await git.commit('RELEASE');
    await git.push();
    await execAsync('yarn workspaces foreach --all run rimraf dist');
  },
  clear: async () => {
    const command = (await isMonorepo()) ? 'yarn workspaces foreach --all run rimraf dist .next' : 'yarn rimraf dist .next';
    await execAsync(command);
  },
};
