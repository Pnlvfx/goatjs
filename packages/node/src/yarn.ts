import { execAsync } from './exec.js';
import { spawnWithLog } from './dev/spawn.js';

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
    const { stdout } = await execAsync('yarn workspaces list --json');
    return stdout
      .trim()
      .split('\n')
      .map((line) => JSON.parse(line) as ListItem);
  },
};

export const yarn = {
  workspace,
  config: {
    get: async (name: string) => {
      const { stdout } = await execAsync(`yarn config ${name} --json`);
      const json = JSON.parse(stdout) as YarnConfig;
      return json.effective ?? undefined;
    },
    set: async (name: string, value: string) => spawnWithLog('yarn', ['config', 'set', name, value]),
  },
};
