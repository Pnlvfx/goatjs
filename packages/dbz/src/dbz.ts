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
  noClear?: boolean;
  noGit?: boolean;
}

export const dbz = {
  publish: async ({ version, noClear, noGit }: PublishParams = {}) => {
    const git = createGitClient();
    await (noGit ? input.create({ title: 'Are you sure you want to publish without git checks?' }) : checkGitStatus());
    const monorepo = await yarn.isMonorepo();
    if (monorepo) {
      consoleColor('yellow', "dbz detect that you're running in a monorepo. Please ensure to run this scripts from the root.");
      await yarn.workspace.runAll(['run', 'build']);
    }
    await publish({ version, monorepo });
    if (noGit) {
      // eslint-disable-next-line no-console
      console.warn('commit skipped, make sure to commit the new versions yourself or you might face versions issue later on.');
    } else {
      await git.add();
      await git.commit('RELEASE');
      await git.push();
    }
    if (noClear) {
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
