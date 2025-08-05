import { execAsync } from '@goatjs/node/exec';
import { spawnStdio } from '@goatjs/node/terminal/stdio';

export interface PublishOptions {
  version?: YarnVersion;
}

interface InternalPublishOptions extends PublishOptions {
  monorepo: boolean;
}

export const publish = async ({ version = 'minor', monorepo }: InternalPublishOptions) => {
  await increaseVersion({ monorepo, version });
  await safePublish({ monorepo });
};

// KEEP THIS AS A STANDALONE FUNCTION AS WE WANT TO GIT RESET ONLY IF IT FAIL WHILE PUBLISHING.
const safePublish = async ({ monorepo }: { monorepo: boolean }) => {
  try {
    await spawnStdio('yarn', monorepo ? publishArgs.monorepo : publishArgs.standalone);
  } catch (err) {
    const command = monorepo ? 'git checkout -- "**/package.json"' : 'git checkout -- package.json';
    await execAsync(command);
    throw err;
  }
};

const publishArgs = {
  standalone: ['npm', 'publish'],
  monorepo: ['workspaces', 'foreach', '--all', '--no-private', 'npm', 'publish'],
};

const versionArgs = {
  standalone: ['version'],
  monorepo: ['workspaces', 'foreach', '--all', '--no-private', 'version'],
};

export const supportedVersions = ['major', 'minor', 'patch'] as const;
type YarnVersion = (typeof supportedVersions)[number];

export const isValidYarnVersion = (version: string): version is YarnVersion => {
  return supportedVersions.includes(version as YarnVersion);
};

const increaseVersion = ({ monorepo, version }: { monorepo: boolean; version: YarnVersion }) => {
  const args = monorepo ? versionArgs.monorepo : versionArgs.standalone;
  return spawnStdio('yarn', [...args, version]);
};
