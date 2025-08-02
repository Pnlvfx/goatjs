import { consoleColor } from '@goatjs/node/console-color';
import { git } from '@goatjs/node/git/git';
import { checkGitStatus, getAccessToken, isMonorepo } from './helpers.js';
import { publish, type PublishOptions } from './publish.js';
import { rimraf } from '@goatjs/rimraf';
import { execAsync } from '@goatjs/node/exec';
import { platform } from 'node:os';
import fs from 'node:fs/promises';
import { spawnStdio } from '@goatjs/node/terminal/stdio';

interface DbzPublishOptions extends PublishOptions {
  provider?: 'gcp' | 'verdaccio';
}

export const dbz = {
  config: {
    set: async (name: string, value: string) => spawnStdio('yarn', ['config', 'set', name, value]),
  },
  createYarnEnv: async () => {
    await fs.writeFile('.env.yarn', `YARN_NPM_AUTH_TOKEN = ${await getAccessToken()}`);
  },
  auth: async (): Promise<void> => {
    const token = await getAccessToken();
    await (platform() === 'win32' ? execAsync(`set YARN_NPM_AUTH_TOKEN=${token}`) : execAsync(`export YARN_NPM_AUTH_TOKEN="${token}"`));
  },
  publish: async ({ version }: DbzPublishOptions = {}) => {
    const monorepo = await isMonorepo();
    if (monorepo) {
      consoleColor('yellow', "dbz detect that you're running in a monorepo. Please ensure to run this scripts from the root.");
    }
    await checkGitStatus();
    await publish({ version, monorepo });
    await git.add();
    await git.commit('RELEASE');
    await git.push();
  },
  clear: async () => {
    if (await isMonorepo()) {
      await rimraf('.turbo');
      await execAsync('yarn workspaces foreach --all run rimraf dist .turbo .next');
    } else {
      await execAsync('yarn rimraf dist .next');
    }
  },
};
