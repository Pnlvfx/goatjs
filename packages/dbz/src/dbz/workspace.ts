import { spawnWithLog } from '@goatjs/node/spawn';

export const workspace = {
  runAll: async (command: string[], { includePrivate }: { includePrivate?: boolean } = {}) => {
    const args = ['workspaces', 'foreach'];
    if (!includePrivate) {
      args.push('--all', '--no-private');
    }
    return spawnWithLog('yarn', [...args, ...command]);
  },
};
