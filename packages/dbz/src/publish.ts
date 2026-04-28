import { execAsync } from '@goatjs/node/exec';
import path from 'node:path';
import { getChangedWorkspaces, getWorkspaceVersion } from './changed.ts';
import { getPkgJSON } from '@goatjs/node/package-json';
import { execa } from 'execa';

export interface PublishOptions {
  version?: YarnVersion;
}

interface InternalPublishOptions extends PublishOptions {
  monorepo: boolean;
}

export interface PublishedPackage {
  name: string;
  version: string;
}

export const publish = async ({ version = 'minor', monorepo }: InternalPublishOptions): Promise<PublishedPackage[]> => {
  if (!monorepo) {
    await execa('yarn', ['version', version], { stdio: 'inherit' });
    try {
      await execa('yarn', ['npm', 'publish'], { stdio: 'inherit' });
    } catch (err) {
      await execAsync('git checkout -- package.json');
      throw err;
    }
    const pkg = await getPkgJSON(path.resolve('package.json'));
    if (!pkg.version) throw new Error('Missing version in package.json');
    return [{ name: pkg.name, version: pkg.version }];
  }

  const changed = await getChangedWorkspaces();

  if (changed.length === 0) {
    // eslint-disable-next-line no-console
    console.log('Nothing to publish - no packages changed since last release.');
    return [];
  }

  const names = changed.map((w) => w.name).join(', ');
  // eslint-disable-next-line no-console
  console.log(`Publishing ${changed.length.toString()} package(s): ${names}`);

  const includeArgs = ['--all', ...changed.flatMap((w) => ['--include', w.name])];

  await execa('yarn', ['workspaces', 'foreach', ...includeArgs, 'version', version], { stdio: 'inherit' });

  // eslint-disable-next-line no-console
  console.log(`About to publish: ${names}`);

  try {
    await execa('yarn', ['workspaces', 'foreach', ...includeArgs, 'npm', 'publish'], { stdio: 'inherit' });
  } catch (err) {
    await execAsync(String.raw`git checkout -- **/package.json`);
    throw err;
  }

  const published: PublishedPackage[] = [];
  for (const w of changed) {
    const ver = await getWorkspaceVersion(w.location);
    published.push({ name: w.name, version: ver });
  }

  return published;
};

const supportedVersions = ['major', 'minor', 'patch'] as const;
type YarnVersion = (typeof supportedVersions)[number];

export const isValidYarnVersion = (version: string): version is YarnVersion => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  return supportedVersions.includes(version as YarnVersion);
};
