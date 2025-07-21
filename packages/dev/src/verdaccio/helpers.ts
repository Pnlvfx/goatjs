import { git } from '@goatjs/git';

export const checkGitStatus = async ({ cwd }: { cwd?: string } = {}) => {
  const changes = await git.status({ porcelain: true }, { cwd });
  if (changes) throw new Error('You have uncommitted changes, please resolve them before continuing...');
};
