/* eslint-disable unicorn/no-useless-undefined */
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
  fetch: (options?: ExecOptions) => {
    return execAsync('git fetch origin', options);
  },
  revList: (options?: ExecOptions) => {
    // add support for branch other than main
    return execAsync('git rev-list --count HEAD..origin/main', options);
  },
  getBranchList: (options?: ExecOptions) => {
    return execAsync('git branch --list', options);
  },
  branch: async (name: string, options?: ExecOptions) => {
    try {
      return await execAsync(`git branch ${name}`, options);
    } catch {
      return undefined;
    }
  },
  deleteBranch: async (name: string, options?: ExecOptions) => {
    try {
      await execAsync(`git branch -D ${name}`, options);
      await execAsync(`git push origin --delete ${name}`, options);
    } catch {}
  },
  checkout: (name: string, options?: ExecOptions) => {
    return execAsync(`git checkout ${name}`, options);
  },
  add: (fromPath = '.', options?: ExecOptions) => {
    return execAsync(`git add ${fromPath}`, options);
  },
  commit: (message: string, options?: ExecOptions) => {
    return execAsync(`git commit -m "${message}"`, options);
  },
  push: (options?: ExecOptions) => {
    return execAsync('git push', options);
  },
  pull: (options?: ExecOptions) => {
    return execAsync('git pull', options);
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
