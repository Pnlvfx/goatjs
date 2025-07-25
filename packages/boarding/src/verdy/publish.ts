import { execAsync } from '@goatjs/node/exec';

export interface PublishOptions {
  version?: YarnVersion;
}

interface InternalPublishOptions extends PublishOptions {
  isMonorepo: boolean;
}

export const publish = async ({ version = 'patch', isMonorepo }: InternalPublishOptions) => {
  await increaseVersion({ isMonorepo, version });
  await safePublish({ isMonorepo });
};

// KEEP THIS AS A STANDALONE FUNCTION AS WE WANT TO GIT RESET ONLY IF IT FAIL WHILE PUBLISHING.
const safePublish = async ({ isMonorepo }: { isMonorepo: boolean }) => {
  try {
    await execAsync(isMonorepo ? publishCommand.monorepo : publishCommand.standalone);
  } catch (err) {
    const command = isMonorepo ? 'git checkout -- "**/package.json"' : 'git checkout -- package.json';
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

const increaseVersion = ({ isMonorepo, version }: { isMonorepo: boolean; version: YarnVersion }) => {
  const command = isMonorepo ? versionCommand.monorepo : versionCommand.standalone;
  return execAsync(`${command} ${version}`);
};
