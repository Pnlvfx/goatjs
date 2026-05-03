import { consoleColor } from '@goatjs/node/console-color';
import { publish, type PublishOptions } from './publish.ts';
import { createGitClient } from '@goatjs/node/git';
import { checkGitStatus } from './git.ts';
import { yarn } from './yarn.ts';
import { getChangedWorkspaces } from './changed.ts';
import { clear, createReleaseTags } from './helpers.ts';
import { execa } from 'execa';

export const dbz = {
  publish: async ({ version }: PublishOptions = {}) => {
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
      await execa('yarn', ['build', ...filterArgs], { stdio: 'inherit' });
    }
    const published = await publish({ version, monorepo });
    if (published.length === 0) return;

    const packages = published.map((p) => [p.name, p.version].join('@')).join(', ');
    await git.add();
    await git.commit(['chore(release): publish', packages].join(' '));
    await git.push();
    await createReleaseTags(git, published);
  },
  unpublish: async (pkgName: string) => {
    const npmScopes = await yarn.config.get('npmScopes');
    const registry = npmScopes; // yarn with json doesn't give us the publish registry,
    if (!registry) throw new Error('Registry not found!');
    await execa('npm', ['unpublish', pkgName, '--force', '--registry', registry], { stdio: 'inherit' });
  },
  clear,
};
