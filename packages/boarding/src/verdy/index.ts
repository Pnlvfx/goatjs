import { execAsync } from '@goatjs/node/exec';
import { checkGitStatus, isMonorepo } from './helpers.js';
import { git } from '../git/index.js';
import { rimraf } from '@goatjs/rimraf';
import { publish, type PublishOptions } from './publish.js';
import { consoleColor } from '@goatjs/node/console-color';

// TODO [2025-07-30] IMPORTANT breaking change,for monorepo use monorepo.publish and create a cli where you can do:
// pass a scope like @goatjs. and do yarn verdaccio publish pslist boarding core node ecc or yarn verdaccio publish all to publish all.
// the version patch still need to be performed on all, but publish run only on the required packages

// TODO [2025-07-30] use spawn to run publish and add more consoleColors

export const verdy = {
  publish: async ({ version }: PublishOptions = {}) => {
    consoleColor('yellow', "Verdy detect that you're running in a monorepo. Please ensure to run this scripts from the root only.");
    await checkGitStatus();
    await publish({ version, isMonorepo: await isMonorepo() });
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
