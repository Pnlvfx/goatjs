import fs from 'node:fs/promises';
import path from 'node:path';

// TODO check the result of this in a monorepo setup
export const getProjectName = async () => {
  const buf = await fs.readFile('package.json');
  const { name } = JSON.parse(buf.toString()) as { name?: string };
  if (!name) throw new Error('Unable to find package.json name.');
  return name.replace('api-', '');
};

export const mkDir = async (folder: string, recursive?: boolean) => {
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  if (!(await exist(folder))) {
    validatePath(folder);
    await fs.mkdir(folder, { recursive });
  }
};

// TODO We have to use the goatjs/node/fs import instead of this, but it will break the build I think
/** @deprecated use import {fs} from "@goatjs/core/fs" */
const exist = async (file: string) => {
  try {
    // eslint-disable-next-line no-restricted-properties
    await fs.access(file);
    return true;
  } catch {
    return false;
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
