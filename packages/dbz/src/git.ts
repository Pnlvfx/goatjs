import { toNumber } from '@goatjs/core/number';
import { createGitClient } from '@goatjs/node/git';
import { input } from '@goatjs/node/input';

export const checkGitStatus = async ({ cwd }: { cwd?: string } = {}) => {
  const git = createGitClient({ cwd });
  await git.fetch();
  const { stdout } = await git.revList();
  const remoteChanges = toNumber(stdout);

  if (remoteChanges > 0) {
    const text = await input.create({
      title: 'You have remote changes to pull, please send "ok" if you want to run git pull or do it manually yourself.',
    });
    if (text === 'ok') {
      await git.pull();
    }
  }
  const localChanges = await git.status({ porcelain: true });

  if (localChanges) {
    const text = await input.create({
      title: 'You have uncommitted changes, insert a valid git message here to let us commit for you. An empty message will abort the operation.',
    });
    if (!text) throw new Error('You have uncommitted changes, please resolve them before continuing...');
    await git.add();
    await git.commit(text);
    await git.push();
  }
};
