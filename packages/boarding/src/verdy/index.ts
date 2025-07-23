import { execAsync } from '@goatjs/node/exec';
import { checkGitStatus } from './helpers.js';
import { git } from '../git/index.js';
import { rimraf } from '@goatjs/rimraf';

// TODO IMPORTANT breaking change,for monorepo use monorepo.publish and create a cli where you can do:
// pass a scope like @goatjs. and do yarn verdaccio publish pslist boarding core node ecc or yarn verdaccio publish all to publish all.
// the version patch still need to be performed on all, but publish run only on the required packages

export const verdy = {
  publish: async () => {
    await checkGitStatus();
    await execAsync('yarn version patch');
    await git.add();
    await git.commit('RELEASE');
    await git.push();
    await execAsync('yarn npm publish');
  },
  monorepo: {
    publish: async (_packages?: string[]) => {
      await checkGitStatus();
      await execAsync('yarn workspaces foreach --all --no-private version patch');
      await git.add();
      await git.commit('RELEASE');
      await git.push();
      await execAsync('yarn workspaces foreach --all --no-private npm publish');
    },
    clear: async () => {
      await rimraf('.turbo');
      await execAsync('yarn workspaces foreach --all run rimraf dist .turbo .next');
    },
  },
};
