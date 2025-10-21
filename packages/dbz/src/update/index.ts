import { spawnWithLog } from '@goatjs/node/dev/spawn';

export const updateUnversionedDeps = async (packages: Record<string, string>) => {
  const deps = Object.entries(packages).map(([name, version]) => `${name}@${version}`);
  await spawnWithLog('yarn', ['up', ...deps]);
};
