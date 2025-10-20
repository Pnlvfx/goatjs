import type { ExecOptions } from 'node:child_process';
import { execAsync } from './exec.js';
import { parseBashOptions } from './bash.js';

interface GitStatusParams extends ExecOptions {
  porcelain?: boolean;
}

export const git = {
  clone: (url: string, options?: ExecOptions) => {
    return execAsync(`git clone ${url}`, options);
  },
  fetch: () => {
    return execAsync('git fetch origin');
  },
  revList: () => {
    // add support for branch other than main
    return execAsync('git rev-list --count HEAD..origin/main');
  },
  getBranchList: (options?: ExecOptions) => {
    return execAsync('git branch --list', options);
  },
  getBranch: async (name: string, options?: ExecOptions) => {
    try {
      await execAsync(`git branch ${name}`, options);
    } catch {}
  },
  deleteBranch: async (name: string, options?: ExecOptions) => {
    try {
      await execAsync(`git branch -D ${name}`, options);
      await execAsync(`git push origin --delete ${name}`, options);
    } catch {}
  },
  checkout: async (name: string, options?: ExecOptions) => {
    await execAsync(`git checkout ${name}`, options);
  },
  add: async (fromPath = '.', options?: ExecOptions) => {
    await execAsync(`git add ${fromPath}`, options);
  },
  commit: async (message: string, options?: ExecOptions) => {
    await execAsync(`git commit -m "${message}"`, options);
  },
  push: async (options?: ExecOptions) => {
    await execAsync('git push', options);
  },
  pull: async (options?: ExecOptions) => {
    await execAsync('git pull', options);
  },
  status: async ({ porcelain, ...options }: GitStatusParams = {}) => {
    const { stdout } = await execAsync(`git status${parseBashOptions({ porcelain })}`, options);
    return stdout;
  },
  reset: ({ hard, amount = 1 }: { hard?: boolean; amount?: number } = {}) => {
    let command = 'git reset';
    if (hard) {
      command += ' --hard';
    }
    command += ` HEAD~${amount.toString()}`;
    return execAsync(command);
  },
};
