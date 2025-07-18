import { execAsync } from '@goatjs/node/exec';
import { git } from '@goatjs/git';
import { checkGitStatus } from './helpers.js';

export const verdaccio = {
  publish: async () => {
    await checkGitStatus();
    await execAsync('yarn version patch');
    await git.add();
    await git.commit('RELEASE');
    await git.push();
    await execAsync('yarn npm publish');
  },
  publishAll: async () => {
    await checkGitStatus();
    await execAsync('yarn workspaces foreach --all --no-private version patch');
    await git.add();
    await git.commit('RELEASE');
    await git.push();
    await execAsync('yarn workspaces foreach --all --no-private npm publish');
  },
};
