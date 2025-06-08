import fs from 'node:fs/promises';

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
