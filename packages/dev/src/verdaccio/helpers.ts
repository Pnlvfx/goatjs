import { git } from '@goatjs/git';

export const checkGitStatus = async () => {
  const changes = await git.status({ porcelain: true });
  if (changes) throw new Error('You have uncommitted changes, please resolve them before continuing...');
};
