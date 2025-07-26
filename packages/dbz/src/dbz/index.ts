import { consoleColor } from '@goatjs/node/console-color';
import { git } from '@goatjs/node/git/git';
import { checkGitStatus, isMonorepo } from './helpers.js';
import { publish, type PublishOptions } from './publish.js';
import { rimraf } from '@goatjs/rimraf';
import { execAsync } from '@goatjs/node/exec';

interface DbzPublishOptions extends PublishOptions {
  provider?: 'gcp' | 'verdaccio';
}

export const dbz = {
  publish: async ({ version, provider = 'gcp' }: DbzPublishOptions = {}) => {
    const monorepo = await isMonorepo();
    if (monorepo) {
      consoleColor('yellow', "Verdy detect that you're running in a monorepo. Please ensure to run this scripts from the root only.");
    }
    await checkGitStatus();
    if (provider === 'gcp') {
      await execAsync('yarn config set npmAuthToken $(gcloud auth print-access-token)');
    }
    await publish({ version, monorepo });
    if (provider === 'gcp') {
      await execAsync('yarn config unset npmAuthToken');
    }
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
