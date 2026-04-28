import type { createGitClient } from '@goatjs/node/git';
import type { PublishedPackage } from './publish.ts';
import { yarn } from './yarn.ts';
import { execa } from 'execa';

export const createReleaseTags = async (git: ReturnType<typeof createGitClient>, published: PublishedPackage[]) => {
  for (const pkg of published) {
    await git.createTag(`${pkg.name}@${pkg.version}`);
  }
  await git.pushTags();
};

export const clear = async ({ extra }: { extra?: string[] } = {}) => {
  const monorepo = await yarn.isMonorepo();
  const foldersToInclude = ['dist', '.next', ...(extra ?? [])];
  await (monorepo
    ? yarn.workspace.runAll(['run', 'rimraf', ...foldersToInclude], { includePrivate: true })
    : execa('yarn', ['rimraf', ...foldersToInclude], { stdio: 'inherit' }));
};
