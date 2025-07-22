import path from 'node:path';

/** Check if the given path has invalid windows characters. */
export const validatePath = (pth: string) => {
  if (process.platform === 'win32') {
    const pathHasInvalidWinCharacters = /["*:<>?|]/.test(pth.replace(path.parse(pth).root, ''));
    if (pathHasInvalidWinCharacters) throw new Error(`Path contains invalid characters: ${pth}`);
  }
};
