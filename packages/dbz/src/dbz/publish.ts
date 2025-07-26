import { execAsync } from '@goatjs/node/exec';
import { spawnInteractive } from './helpers.js';

export interface PublishOptions {
  version?: YarnVersion;
}

interface InternalPublishOptions extends PublishOptions {
  monorepo: boolean;
}

export const publish = async ({ version = 'patch', monorepo }: InternalPublishOptions) => {
  await increaseVersion({ monorepo, version });
  await safePublish({ monorepo });
};

// KEEP THIS AS A STANDALONE FUNCTION AS WE WANT TO GIT RESET ONLY IF IT FAIL WHILE PUBLISHING.
const safePublish = async ({ monorepo }: { monorepo: boolean }) => {
  try {
    await execAsync(monorepo ? publishCommand.monorepo : publishCommand.standalone);
  } catch (err) {
    const command = monorepo ? 'git checkout -- "**/package.json"' : 'git checkout -- package.json';
    await execAsync(command);
    throw err;
  }
};

const publishCommand = {
  standalone: 'yarn npm publish',
  monorepo: 'yarn workspaces foreach --all --no-private npm publish',
};

const versionCommand = {
  standalone: 'yarn version',
  monorepo: 'yarn workspaces foreach --all --no-private version',
};

export const supportedVersions = ['major', 'minor', 'patch'] as const;
type YarnVersion = (typeof supportedVersions)[number];

export const isValidYarnVersion = (version: string): version is YarnVersion => {
  return supportedVersions.includes(version as YarnVersion);
};

const increaseVersion = ({ monorepo, version }: { monorepo: boolean; version: YarnVersion }) => {
  const command = monorepo ? versionCommand.monorepo : versionCommand.standalone;
  return execAsync(`${command} ${version}`);
};
