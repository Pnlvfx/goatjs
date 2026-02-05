import { consoleColor } from '@goatjs/node/console-color';
import { publish, type PublishOptions } from './publish.js';
import { createGitClient } from '@goatjs/node/git';
import { checkGitStatus } from './git.js';
import { yarn } from './yarn.js';
import { spawnWithLog } from './spawn.js';
import { input } from '@goatjs/node/input';

const clear = async ({ extra }: { extra?: string[] } = {}) => {
  const monorepo = await yarn.isMonorepo();
  const foldersToInclude = ['dist', '.next', ...(extra ?? [])];
  await (monorepo
    ? yarn.workspace.runAll(['run', 'rimraf', ...foldersToInclude], { includePrivate: true })
    : spawnWithLog('yarn', ['rimraf', ...foldersToInclude]));
};

export interface PublishParams extends PublishOptions {
  skipClear?: boolean;
  skipGit?: boolean;
}

export const dbz = {
  publish: async ({ version, skipClear, skipGit }: PublishParams = {}) => {
    const git = createGitClient();
    await (skipGit ? input.create({ title: 'Are you sure you want to publish without git checks?', color: 'red' }) : checkGitStatus());
    const monorepo = await yarn.isMonorepo();
    if (monorepo) {
      consoleColor('yellow', "dbz detect that you're running in a monorepo. Please ensure to run this scripts from the root.");
      // changed to this, this has a limitation that build also the private packages, but this is cached compared to the commented one.
      await spawnWithLog('yarn', ['build']);
      // await yarn.workspace.runAll(['run', 'build']);
    }
    await publish({ version, monorepo });
    if (skipGit) {
      // eslint-disable-next-line no-console
      console.warn('commit skipped, make sure to commit the new versions yourself or you might face versions issue later on.');
    } else {
      await git.add();
      await git.commit('RELEASE');
      await git.push();
    }
    if (!skipClear) {
      await clear();
    }
  },
  unpublish: async (pkgName: string) => {
    const npmScopes = await yarn.config.get('npmScopes');
    const registry = npmScopes; // yarn with json doesn't give us the publish registry,
    if (!registry) throw new Error('Registry not found!');
    await spawnWithLog('npm', ['unpublish', pkgName, '--force', '--registry', registry]);
  },
  clear,
};
