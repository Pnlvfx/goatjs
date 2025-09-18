import { execAsync } from './exec.js';
import { spawnWithLog } from './spawn.js';

export interface ListItem {
  location: string;
  name: string;
}

const workspace = {
  runAll: async (command: string[], { includePrivate }: { includePrivate?: boolean } = {}) => {
    const args = ['workspaces', 'foreach', '--all'];
    if (!includePrivate) {
      args.push('--no-private');
    }
    return spawnWithLog('yarn', [...args, ...command]);
  },
  list: async () => {
    const { stdout } = await execAsync('yarn workspaces list --json');
    return JSON.parse(stdout) as ListItem[];
  },
};

export const yarn = {
  workspace,
  config: {
    set: async (name: string, value: string) => spawnWithLog('yarn', ['config', 'set', name, value]),
  },
};
