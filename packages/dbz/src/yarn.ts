import { execa } from 'execa';
import { spawnWithLog } from './spawn.ts';
import { getRootPkgJSON } from '@goatjs/node/package-json';

export interface ListItem {
  location: string;
  name: string;
}

interface YarnConfig {
  key: string;
  effective: string | null;
  source: string;
  description: string;
  type: 'STRING';
  default: null;
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
    const { stdout } = await execa('yarn', ['workspaces', 'list', '--json']);
    return stdout
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as ListItem);
  },
};

export const yarn = {
  isMonorepo: async () => {
    const pkg = await getRootPkgJSON();
    return Array.isArray(pkg.workspaces);
  },
  workspace,
  config: {
    get: async (name: string) => {
      const { stdout } = await execa('yarn', ['config', name, '--json']);
      const json = JSON.parse(stdout) as YarnConfig;
      return json.effective ?? undefined;
    },
    set: async (name: string, value: string) => spawnWithLog('yarn', ['config', 'set', name, value]),
  },
};
