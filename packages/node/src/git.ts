/* eslint-disable unicorn/no-useless-undefined */
import { execAsync } from './exec.js';
import { parseBashOptions } from './bash.js';

export const createGitClient = ({ cwd }: { cwd?: string } = {}) => {
  const runGitCommand = (command: string) => execAsync(command, { cwd });

  return {
    clone: (url: string) => {
      return runGitCommand(`git clone ${url}`);
    },
    stash: () => {
      return runGitCommand('git stash');
    },
    fetch: () => {
      return runGitCommand('git fetch origin');
    },
    revList: () => {
      // add support for branch other than main
      return runGitCommand('git rev-list --count HEAD..origin/main');
    },
    getBranchList: () => {
      return runGitCommand('git branch --list');
    },
    branch: async (name: string) => {
      try {
        return await runGitCommand(`git branch ${name}`);
      } catch {
        return undefined;
      }
    },
    deleteBranch: async (name: string) => {
      try {
        await runGitCommand(`git branch -D ${name}`);
        await runGitCommand(`git push origin --delete ${name}`);
      } catch {}
    },
    checkout: (name: string) => {
      return execAsync(`git checkout ${name}`);
    },
    add: (from = '.') => {
      return runGitCommand(`git add ${from}`);
    },
    commit: (message: string) => {
      return runGitCommand(`git commit -m "${message}"`);
    },
    push: () => {
      return runGitCommand('git push');
    },
    pull: () => {
      return runGitCommand('git pull');
    },
    status: async ({ porcelain }: { porcelain?: boolean } = {}) => {
      const { stdout } = await runGitCommand(`git status ${parseBashOptions({ porcelain })}`);
      return stdout;
    },
    reset: ({ hard, amount }: { hard?: boolean; amount?: number } = {}) => {
      let command = 'git reset';
      if (hard) {
        command += ' --hard';
      }
      if (amount) {
        command += ` HEAD~${amount.toString()}`;
      }
      return runGitCommand(command);
    },
  };
};
