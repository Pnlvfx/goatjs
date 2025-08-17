import { execa } from 'execa';

export const workspace = {
  runAll: async (command: string[], { includePrivate }: { includePrivate?: boolean } = {}) => {
    const args = ['workspaces', 'foreach'];
    if (!includePrivate) {
      args.push('--all', '--no-private');
    }
    return execa('yarn', [...args, ...command]);
  },
};
