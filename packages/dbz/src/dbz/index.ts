import { consoleColor } from '@goatjs/node/console-color';
import { git } from '@goatjs/node/git/git';
import { checkGitStatus, isMonorepo } from './helpers.js';
import { publish, type PublishOptions } from './publish.js';
import { rimraf } from '@goatjs/rimraf';
import { execAsync } from '@goatjs/node/exec';
import { addAccessToken } from './auth.js';

interface DbzPublishOptions extends PublishOptions {
  provider?: 'gcp' | 'verdaccio';
}

// TODO [2025-07-28] Menage access token reusability rather than always getting a new one.

export const dbz = {
  add: async (packages: string[]) => {
    await addAccessToken();
    await execAsync(`yarn add ${packages.join(' ')}`);
  },
  update: async () => {
    await addAccessToken();
    await execAsync('yarn upgrade-interactive');
  },
  publish: async ({ version, provider = 'gcp' }: DbzPublishOptions = {}) => {
    const monorepo = await isMonorepo();
    if (monorepo) {
      consoleColor('yellow', "dbz detect that you're running in a monorepo. Please ensure to run this scripts from the root.");
    }
    await checkGitStatus();
    if (provider === 'gcp') {
      await addAccessToken();
    }
    await publish({ version, monorepo });
    // if (provider === 'gcp') {
    //   await execAsync('yarn config unset npmAuthToken');
    // }
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
