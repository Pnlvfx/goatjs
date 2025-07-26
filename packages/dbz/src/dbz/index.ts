import { consoleColor } from '@goatjs/node/console-color';
import { git } from '@goatjs/node/git/git';
import { checkGitStatus, isMonorepo } from './helpers.js';
import { publish, type PublishOptions } from './publish.js';
import { rimraf } from '@goatjs/rimraf';
import { execAsync } from '@goatjs/node/exec';
import { execWithNpmtoken, getAccessToken, spawnWithNpmToken } from './auth.js';
import { platform } from 'node:os';

interface DbzPublishOptions extends PublishOptions {
  provider?: 'gcp' | 'verdaccio';
}

export const dbz = {
  config: {
    set: async (name: string, value: string) => {
      return execAsync(`yarn config set ${name} ${value}`);
    },
  },
  auth: async (): Promise<void> => {
    const token = await getAccessToken();
    await (platform() === 'win32' ? execAsync(`set YARN_NPM_AUTH_TOKEN=${token}`) : execAsync(`export YARN_NPM_AUTH_TOKEN="${token}"`));
  },
  add: async (packages: string[]) => {
    await execWithNpmtoken(`yarn add ${packages.join(' ')}`);
  },
  update: async () => {
    await spawnWithNpmToken('yarn upgrade-interactive');
  },
  publish: async ({ version, provider: _provider = 'gcp' }: DbzPublishOptions = {}) => {
    const monorepo = await isMonorepo();
    if (monorepo) {
      consoleColor('yellow', "dbz detect that you're running in a monorepo. Please ensure to run this scripts from the root.");
    }
    await checkGitStatus();
    // if (provider === 'gcp') {
    //   await addAccessToken();
    // }
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
