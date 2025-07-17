import fs from 'node:fs/promises';

// TODO ADD A CHECK TO DON'T ALLOW DELETING FILES OUTSIDE THE PACKAGE.JSON
// rename core to js and create a core package which has shared functions
// it has a way to get package.json and we can do that.
// of couse when then have to pack everything to continue use this
// long work.

export const rimraf = async (paths: string | string[]) => {
  const array = Array.isArray(paths) ? paths : [paths];
  for (const path of array) {
    await fs.rm(path, { recursive: true, force: true });
  }
};
