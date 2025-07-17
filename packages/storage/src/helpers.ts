import { pathExist } from '@goatjs/node/fs';
import fs from 'node:fs/promises';
import path from 'node:path';

export const getProjectName = async () => {
  const buf = await fs.readFile('package.json');
  const { name } = JSON.parse(buf.toString()) as { name?: string };
  if (!name) throw new Error('Unable to find package.json name.');
  return name.replace('api-', '');
};

export const mkDir = async (folder: string, recursive?: boolean) => {
  if (!(await pathExist(folder))) {
    validatePath(folder);
    await fs.mkdir(folder, { recursive });
  }
};

/** Check if the given path has invalid windows characters. */
export const validatePath = (pth: string) => {
  if (process.platform === 'win32') {
    const pathHasInvalidWinCharacters = /["*:<>?|]/.test(pth.replace(path.parse(pth).root, ''));

    if (pathHasInvalidWinCharacters) {
      throw new Error(`Path contains invalid characters: ${pth}`);
    }
  }
};
