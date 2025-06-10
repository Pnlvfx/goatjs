import fs from 'node:fs/promises';

// todo ADD A CHECK TO DON'T ALLOW DELETING FILES OUTSIDE THE PACKAGE.JSON

export const rimraf = async (paths: string | string[]) => {
  const array = Array.isArray(paths) ? paths : [paths];
  for (const path of array) {
    await fs.rm(path, { recursive: true, force: true });
  }
};
