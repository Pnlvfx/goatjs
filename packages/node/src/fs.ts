import fsPromises from 'node:fs/promises';

export const fs = {
  exist: async (file: string) => {
    try {
      await fsPromises.access(file);
      return true;
    } catch {
      return false;
    }
  },
};
