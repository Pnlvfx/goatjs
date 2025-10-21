import { consoleColor } from '@goatjs/node/console-color';
import { checkGitStatus } from '@goatjs/node/dev/git';
import { isMonorepo } from './helpers.js';
import { publish, type PublishOptions } from './publish.js';
import { yarn } from '@goatjs/node/yarn';
import { spawnWithLog } from '@goatjs/node/dev/spawn';
import { createGitClient } from '@goatjs/node/git';

const clear = async ({ extra }: { extra?: string[] } = {}) => {
  const monorepo = await isMonorepo();
  const foldersToInclude = ['dist', '.next', ...(extra ?? [])];
  await (monorepo
    ? yarn.workspace.runAll(['run', 'rimraf', ...foldersToInclude], { includePrivate: true })
    : spawnWithLog('yarn', ['rimraf', ...foldersToInclude]));
};

export const dbz = {
  isMonorepo,
  publish: async ({ version }: PublishOptions = {}) => {
    const git = createGitClient();
    await checkGitStatus();
    const monorepo = await isMonorepo();
    if (monorepo) {
      consoleColor('yellow', "dbz detect that you're running in a monorepo. Please ensure to run this scripts from the root.");
      await yarn.workspace.runAll(['run', 'build']);
    }
    await publish({ version, monorepo });
    await git.add();
    await git.commit('RELEASE');
    await git.push();
    await clear();
  },
  clear,
};
