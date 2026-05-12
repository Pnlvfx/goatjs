import { toNumber } from '@goatjs/core/number';
import { createGitClient } from '@goatjs/node/git';
import { input, select } from '@inquirer/prompts';

const COMMIT_TYPES = [
  { value: 'feat', description: 'A new feature' },
  { value: 'fix', description: 'A bug fix' },
  { value: 'chore', description: 'Build process, tooling, deps changes' },
  { value: 'docs', description: 'Documentation only changes' },
  { value: 'style', description: 'Formatting, no logic change' },
  { value: 'refactor', description: 'Neither fix nor feat, restructure only' },
  { value: 'perf', description: 'Performance improvement' },
  { value: 'test', description: 'Adding or fixing tests' },
  { value: 'ci', description: 'CI/CD configuration changes' },
  { value: 'revert', description: 'Revert a previous commit' },
] as const;

const buildCommitMessage = async () => {
  const type = await select({
    message: 'Select commit type:',
    choices: COMMIT_TYPES.map(t => ({ value: t.value, description: t.description })),
  });

  const scope = await input({ message: 'Scope (optional, e.g. auth, ui) - press Enter to skip:' });

  const summary = await input({
    message: 'Short description:',
    validate: v => v.trim().length > 0 || 'Description cannot be empty',
  });

  const prefix = scope.trim() ? `${type}(${scope.trim()})` : type;
  return `${prefix}: ${summary.trim()}`;
};

export const checkGitStatus = async ({ cwd }: { cwd?: string } = {}) => {
  const git = createGitClient({ cwd });
  await git.fetch();
  const { stdout } = await git.revList();
  const remoteChanges = toNumber(stdout);

  if (remoteChanges > 0) {
    const action = await select({
      message: 'You have remote changes to pull. What do you want to do?',
      choices: [
        { value: 'pull', name: 'Run git pull now' },
        { value: 'manual', name: 'I will handle it manually (abort)' },
      ],
    });
    if (action !== 'pull') throw new Error('Make sure your branch is aligned with the remote one before proceeding.');
    await git.pull();
  }

  const localChanges = await git.status({ porcelain: true });

  if (localChanges) {
    const message = await buildCommitMessage();
    await git.add();
    await git.commit(message);
    await git.push();
  }
};
