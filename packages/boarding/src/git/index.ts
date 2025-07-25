import type { GitStatusParams } from './types.js';
import type { ExecOptions } from 'node:child_process';
import { execAsync } from '@goatjs/node/exec';
import { parseBashOptions } from './params.js';

export const git = {
  clone: (url: string, options?: ExecOptions) => {
    return execAsync(`git clone ${url}`, options);
  },
  getBranchList: (options?: ExecOptions) => {
    return execAsync('git branch --list', options);
  },
  branch: async (name: string, options?: ExecOptions) => {
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
    return stdout.trim();
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
