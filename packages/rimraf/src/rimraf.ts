import fs from 'node:fs/promises';

export const rimraf = async (...paths: string[]) => {
  for (const path of paths) {
    await fs.rm(path, { recursive: true, force: true });
  }
};
