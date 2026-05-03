import { createGitClient } from '@goatjs/node/git';
import { yarn, type ListItem } from './yarn.ts';
import path from 'node:path';
import { getPkgJSON } from '@goatjs/node/package-json';

interface WorkspaceWithVersion extends ListItem {
  version: string;
}

export const getWorkspaceVersion = async (location: string): Promise<string> => {
  const pkg = await getPkgJSON(path.resolve(location, 'package.json'));
  if (!pkg.version) throw new Error(`Missing package version for ${pkg.name}`);
  return pkg.version;
};

export const getChangedWorkspaces = async (): Promise<ListItem[]> => {
  const git = createGitClient();
  const all = await yarn.workspace.list({ includePrivate: false });
  const withVersions: WorkspaceWithVersion[] = [];
  for (const w of all) {
    const version = await getWorkspaceVersion(w.location);
    withVersions.push({ ...w, version });
  }

  const changedNames = new Set<string>();

  for (const w of withVersions) {
    const changed = await hasChangedSinceTag(git, w.name, w.version, w.location);
    if (changed) changedNames.add(w.name);
  }

  // include dependents of changed packages — sequential so mutations are visible to later iterations
  for (const w of withVersions) {
    if (!changedNames.has(w.name)) {
      const deps = await getWorkspaceDeps(w.location);
      const dependsOnChanged = deps.some((d) => changedNames.has(d));
      if (dependsOnChanged) changedNames.add(w.name);
    }
  }

  return withVersions.filter((w) => changedNames.has(w.name));
};

const getWorkspaceDeps = async (location: string): Promise<string[]> => {
  const pkg = await getPkgJSON(path.resolve(location, 'package.json'));
  return Object.keys(pkg.dependencies ?? {});
};

const hasChangedSinceTag = async (
  git: ReturnType<typeof createGitClient>,
  name: string,
  version: string,
  location: string,
) => {
  const tag = `${name}@${version}`;
  const exists = await git.tagExists(tag);
  const diff = exists ? await git.diffSince(tag, location) : '';
  return !exists || diff.length > 0;
};
