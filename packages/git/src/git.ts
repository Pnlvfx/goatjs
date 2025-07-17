import type { GitStatusParams } from './types.js';
import { execAsync } from '@goatjs/node/exec';
import { parseBashOptions } from './params.js';

export const git = {
  clone: async (url: string) => {
    await execAsync(`git clone ${url}`);
  },
  getBranchList: async () => {
    await execAsync('git branch --list');
  },
  branch: async (name: string) => {
    try {
      await execAsync(`git branch ${name}`);
    } catch {}
  },
  deleteBranch: async (name: string) => {
    try {
      await execAsync(`git branch -D ${name}`);
      await execAsync(`git push origin --delete ${name}`);
    } catch {}
  },
  checkout: async (name: string) => {
    await execAsync(`git checkout ${name}`);
  },
  add: async (fromPath = '.') => {
    await execAsync(`git add ${fromPath}`);
  },
  commit: async (message: string) => {
    await execAsync(`git commit -m "${message}"`);
  },
  push: async () => {
    await execAsync('git push');
  },
  pull: async () => {
    await execAsync('git pull');
  },
  status: async ({ porcelain }: GitStatusParams) => {
    const { stdout } = await execAsync(`git status${parseBashOptions({ porcelain })}`);
    return stdout.trim();
  },
};
