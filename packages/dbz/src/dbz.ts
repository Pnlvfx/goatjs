import { consoleColor } from '@goatjs/node/console-color';
import { publish, type PublishOptions } from './publish.ts';
import { createGitClient } from '@goatjs/node/git';
import { checkGitStatus } from './git.ts';
import { yarn } from './yarn.ts';
import { getChangedWorkspaces } from './changed.ts';
import { clear, createReleaseTags } from './helpers.ts';
import { execa } from 'execa';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';

// TODO [2026-05-30] add support for non private packages on unpublish too

export const dbz = {
  publish: async ({ version }: PublishOptions = {}) => {
    const git = createGitClient();
    await checkGitStatus();
    const monorepo = await yarn.isMonorepo();
    if (monorepo) {
      const changed = await getChangedWorkspaces();
      consoleColor('yellow', "dbz detect that you're running in a monorepo. Please ensure to run this scripts from the root.");
      if (changed.length === 0) {
        consoleColor('blue', 'Nothing to publish - no packages changed since last release.');
        return;
      }
      const filterArgs = changed.flatMap((w) => ['--filter', w.name]);
      await execa('yarn', ['build', ...filterArgs], { stdio: 'inherit' });
    }
    const published = await publish({ version, monorepo });
    if (published.length === 0) return;

    const packages = published.map((p) => [p.name, p.version].join('@')).join(', ');
    await git.add();
    await git.commit(['chore(release): publish', packages].join(' '));
    await git.push();
    await createReleaseTags(git, published);
  },
  unpublish: async (pkgName: string) => {
    const registry = await getRegistryForPackage(pkgName);
    const token = await getGcpAccessToken();
    // npm doesn't read yarn's GCP auth plugin — pass the token via scoped env var
    const registryHost = registry.replace('https:', '').replace('http:', '');
    const tokenEnvKey = `npm_config_${registryHost}:_authToken`;
    await execa('npm', ['unpublish', pkgName, '--force', '--registry', registry], {
      stdio: 'inherit',
      // eslint-disable-next-line no-restricted-properties
      env: { ...process.env, [tokenEnvKey]: token },
    });
  },
  login: async () => {
    await execa('yarn', ['npm', 'login', '--publish', '--always-auth'], { stdio: 'inherit' });
  },
  clear,
};

const findYarnrcRoot = async (dir = '.'): Promise<string> => {
  const candidate = path.join(dir, '.yarnrc.yml');
  try {
    await access(candidate);
    return dir;
  } catch {
    const parent = path.dirname(dir);
    if (parent === dir) throw new Error('.yarnrc.yml not found in any parent directory');
    return findYarnrcRoot(parent);
  }
};

const getRegistryForPackage = async (pkgName: string) => {
  const scopeEnd = pkgName.indexOf('/');
  if (!pkgName.startsWith('@') || scopeEnd === -1) throw new Error(`Cannot determine scope from package name: ${pkgName}`);
  const scope = pkgName.slice(1, scopeEnd);
  const root = await findYarnrcRoot();
  const yarnrc = await readFile(path.join(root, '.yarnrc.yml'), 'utf8');
  const scopeIdx = yarnrc.indexOf(`  ${scope}:`);
  if (scopeIdx === -1) throw new Error(`Scope @${scope} not found in .yarnrc.yml`);
  const scopeSection = yarnrc.slice(scopeIdx);
  const registryLine = scopeSection.split('\n').find((l) => l.includes('npmPublishRegistry:'));
  if (!registryLine) throw new Error(`npmPublishRegistry not found for scope @${scope} in .yarnrc.yml`);
  return registryLine
    .slice(registryLine.indexOf(':') + 1)
    .trim()
    .replaceAll('"', '')
    .replaceAll("'", '');
};

const getGcpAccessToken = async () => {
  const { stdout } = await execa('gcloud', ['auth', 'print-access-token']);
  const token = stdout.trim();
  if (!token) throw new Error('Failed to get GCP access token via gcloud');
  return token;
};
