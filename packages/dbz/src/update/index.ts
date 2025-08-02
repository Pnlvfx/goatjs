import { spawnStdio } from '@goatjs/node/terminal/stdio';

export const updateUnversionedDeps = async (packages: Record<string, string>) => {
  const deps = Object.entries(packages).map(([name, version]) => `${name}@${version}`);
  await spawnStdio('yarn', ['up', ...deps]);
};
