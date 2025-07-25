import { execAsync } from '@goatjs/node/exec';
import { checkGitStatus } from './helpers.js';
import { git } from '../git/index.js';
import { rimraf } from '@goatjs/rimraf';

// TODO [2025-07-30] IMPORTANT breaking change,for monorepo use monorepo.publish and create a cli where you can do:
// pass a scope like @goatjs. and do yarn verdaccio publish pslist boarding core node ecc or yarn verdaccio publish all to publish all.
// the version patch still need to be performed on all, but publish run only on the required packages

// TODO [2025-07-30] use spawn to run publish and add more consoleColors

interface PublishOptions {
  version?: 'major' | 'minor' | 'patch';
}

export const verdy = {
  publish: async ({ version = 'patch' }: PublishOptions = {}) => {
    await checkGitStatus();
    await execAsync('yarn build'); // test before increasing version.
    await execAsync(`yarn version ${version}`);
    await execAsync('yarn npm publish');
    await git.add();
    await git.commit('RELEASE');
    await git.push();
  },
  monorepo: {
    publish: async (_packages?: string[], { version = 'patch' }: PublishOptions = {}) => {
      await checkGitStatus();
      await execAsync('yarn build'); // test before increasing version.
      await execAsync(`yarn workspaces foreach --all --no-private version ${version}`);
      await execAsync('yarn workspaces foreach --all --no-private npm publish');
      await git.add();
      await git.commit('RELEASE');
      await git.push();
    },
    clear: async () => {
      await rimraf('.turbo');
      await execAsync('yarn workspaces foreach --all run rimraf dist .turbo .next');
    },
  },
};
