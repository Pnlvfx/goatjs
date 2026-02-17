import { execAsync } from '@goatjs/node/exec';
import { yarn } from './yarn.ts';
import { spawnWithLog } from './spawn.ts';

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

const safePublish = async ({ monorepo }: { monorepo: boolean }) => {
  try {
    // const hasCustomRegistry = await yarn.config.get(''); // TODO [2026-12-30] use npm for public pkg
    await (monorepo ? yarn.workspace.runAll(['npm', 'publish']) : spawnWithLog('yarn', ['npm', 'publish']));
  } catch (err) {
    const command = monorepo ? 'git checkout -- "**/package.json"' : 'git checkout -- package.json';
    await execAsync(command);
    throw err;
  }
};

const supportedVersions = ['major', 'minor', 'patch'] as const;
type YarnVersion = (typeof supportedVersions)[number];

export const isValidYarnVersion = (version: string): version is YarnVersion => {
  return supportedVersions.includes(version as YarnVersion);
};

const increaseVersion = ({ monorepo, version }: { monorepo: boolean; version: YarnVersion }) => {
  return monorepo ? yarn.workspace.runAll(['version', version]) : spawnWithLog('yarn', ['version', version]);
};
