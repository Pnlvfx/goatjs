import { createGitClient } from '../git.js';
import { input } from '../input.js';

export const checkGitStatus = async ({ cwd }: { cwd?: string } = {}) => {
  const git = createGitClient({ cwd });
  const changes = await git.status({ porcelain: true });
  if (changes) {
    const text = await input.create({
      title: 'You have uncommitted changes, insert a valid git message here to let us commit for you. An empty message will abort the operation.',
    });
    if (!text) throw new Error('You have uncommitted changes, please resolve them before continuing...');
    await git.add();
    await git.commit(text);
    await git.push();
  }
};
