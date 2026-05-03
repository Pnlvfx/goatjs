import { execa } from 'execa';
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
    return execa('yarn', [...args, ...command], { stdio: 'inherit' });
  },
  list: async ({ includePrivate }: { includePrivate?: boolean } = {}) => {
    const args = ['workspaces', 'list', '--json'];
    if (!includePrivate) args.push('--no-private');
    const { stdout } = await execa('yarn', args);
    return (
      stdout
        .trim()
        .split('\n')
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        .map((line) => JSON.parse(line) as ListItem)
        .filter((w) => w.location !== '.')
    );
  },
};

export const yarn = {
  isMonorepo: async () => {
    const pkg = await getRootPkgJSON();
    if (!Array.isArray(pkg.workspaces)) return false;
    const workspaces = await workspace.list({ includePrivate: false });
    return workspaces.length > 0;
  },
  workspace,
  config: {
    get: async (name: string) => {
      const { stdout } = await execa('yarn', ['config', name, '--json']);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
      const json = JSON.parse(stdout) as YarnConfig;
      return json.effective ?? undefined;
    },
    set: async (name: string, value: string) => execa('yarn', ['config', 'set', name, value], { stdio: 'inherit' }),
  },
};
