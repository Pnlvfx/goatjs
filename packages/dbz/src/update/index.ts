import { execa } from 'execa';

export const updateUnversionedDeps = async (packages: Record<string, string>) => {
  const deps = Object.entries(packages).map(([name, version]) => `${name}@${version}`);
  await execa('yarn', ['up', ...deps]);
};
