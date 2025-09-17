import { spawnWithLog } from './spawn.js';

const workspace = {
  runAll: async (command: string[], { includePrivate }: { includePrivate?: boolean } = {}) => {
    const args = ['workspaces', 'foreach', '--all'];
    if (!includePrivate) {
      args.push('--no-private');
    }
    return spawnWithLog('yarn', [...args, ...command]);
  },
  list: () => spawnWithLog('yarn', ['workspace', 'list', '--json']),
};

export const yarn = {
  workspace,
  config: {
    set: async (name: string, value: string) => spawnWithLog('yarn', ['config', 'set', name, value]),
  },
};
