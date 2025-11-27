import { consoleColor } from '@goatjs/node/console-color';
import { publish, type PublishOptions } from './publish.js';
import { createGitClient } from '@goatjs/node/git';
import { checkGitStatus } from './git.js';
import { yarn } from './yarn.js';
import { spawnWithLog } from './spawn.js';

const clear = async ({ extra }: { extra?: string[] } = {}) => {
  const monorepo = await yarn.isMonorepo();
  const foldersToInclude = ['dist', '.next', ...(extra ?? [])];
  await (monorepo
    ? yarn.workspace.runAll(['run', 'rimraf', ...foldersToInclude], { includePrivate: true })
    : spawnWithLog('yarn', ['rimraf', ...foldersToInclude]));
};

export const dbz = {
  publish: async ({ version }: PublishOptions = {}) => {
    const git = createGitClient();
    await checkGitStatus();
    const monorepo = await yarn.isMonorepo();
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
  unpublish: async (pkgName: string) => {
    const npmScopes = await yarn.config.get('npmScopes');
    const registry = npmScopes; // yarn with json doesn't give us the publish registry,
    if (!registry) throw new Error('Registry not found!');
    await spawnWithLog('npm', ['unpublish', pkgName, '--force', '--registry', registry]);
  },
  clear,
};
