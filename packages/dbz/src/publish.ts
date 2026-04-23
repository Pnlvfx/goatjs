import { execAsync } from '@goatjs/node/exec';
import { createGitClient } from '@goatjs/node/git';
import { spawnWithLog } from './spawn.ts';
import { getChangedWorkspaces, getWorkspaceVersion } from './changed.ts';

export interface PublishOptions {
  version?: YarnVersion;
}

interface InternalPublishOptions extends PublishOptions {
  monorepo: boolean;
}

export const publish = async ({ version = 'minor', monorepo }: InternalPublishOptions) => {
  if (!monorepo) {
    await spawnWithLog('yarn', ['version', version]);
    try {
      await spawnWithLog('yarn', ['npm', 'publish']);
    } catch (err) {
      await execAsync('git checkout -- package.json');
      throw err;
    }
    return;
  }

  const changed = await getChangedWorkspaces();

  if (changed.length === 0) {
    // eslint-disable-next-line no-console
    console.log('Nothing to publish - no packages changed since last release.');
    return;
  }

  const names = changed.map((w) => w.name).join(', ');
  // eslint-disable-next-line no-console
  console.log(`Publishing ${changed.length.toString()} package(s): ${names}`);

  const includeArgs = changed.flatMap((w) => ['--include', w.name]);

  await spawnWithLog('yarn', ['workspaces', 'foreach', ...includeArgs, 'version', version]);

  try {
    await spawnWithLog('yarn', ['workspaces', 'foreach', ...includeArgs, 'npm', 'publish']);
  } catch (err) {
    await execAsync(String.raw`git checkout -- **/package.json`);
    throw err;
  }

  const git = createGitClient();

  for (const w of changed) {
    const ver = await getWorkspaceVersion(w.location);
    await git.createTag(`${w.name}@${ver}`);
  }

  await git.pushTags();
};

const supportedVersions = ['major', 'minor', 'patch'] as const;
type YarnVersion = (typeof supportedVersions)[number];

export const isValidYarnVersion = (version: string): version is YarnVersion => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  return supportedVersions.includes(version as YarnVersion);
};
