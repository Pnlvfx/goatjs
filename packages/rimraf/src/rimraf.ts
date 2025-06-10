import fs from 'node:fs/promises';

export const rimraf = async (paths: string | string[]) => {
  const array = Array.isArray(paths) ? paths : [paths];
  for (const path of array) {
    await fs.rm(path, { recursive: true, force: true });
  }
};
