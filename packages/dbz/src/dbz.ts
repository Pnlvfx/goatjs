import { consoleColor } from '@goatjs/node/console-color';
import { publish, type PublishOptions } from './publish.ts';
import { createGitClient } from '@goatjs/node/git';
import { checkGitStatus } from './git.ts';
import { yarn } from './yarn.ts';
import { spawnWithLog } from './spawn.ts';
import { getChangedWorkspaces } from './changed.ts';
import { clear, createReleaseTags } from './helpers.ts';

export interface PublishParams extends PublishOptions {
  skipClear?: boolean;
}

export const dbz = {
  publish: async ({ version, skipClear = true }: PublishParams = {}) => {
    const git = createGitClient();
    await checkGitStatus();
    const monorepo = await yarn.isMonorepo();
    if (monorepo) {
      const changed = await getChangedWorkspaces();
      consoleColor('yellow', "dbz detect that you're running in a monorepo. Please ensure to run this scripts from the root.");
      if (changed.length === 0) {
        consoleColor('blue', 'Nothing to publish - no packages changed since last release.');
        return;
      }
      const filterArgs = changed.flatMap((w) => ['--filter', w.name]);
      await spawnWithLog('yarn', ['build', ...filterArgs]);
    }
    const published = await publish({ version, monorepo });
    if (published.length === 0) return;

    await git.add();
    await git.commit('RELEASE');
    await git.push();
    await createReleaseTags(git, published);

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
