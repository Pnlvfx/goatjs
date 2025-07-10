import fs from 'node:fs/promises';
import path from 'node:path';

export const clearFolder = async (folder: string) => {
  const contents = await fs.readdir(folder);
  for (const content of contents) {
    await fs.rm(path.join(folder, content));
  }
};

export const pathExist = async (file: string) => {
  try {
    // eslint-disable-next-line no-restricted-properties
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
};

export const isFsError = (error: unknown): error is NodeJS.ErrnoException => {
  return error instanceof Error && 'code' in error && typeof error.code === 'string';
};
