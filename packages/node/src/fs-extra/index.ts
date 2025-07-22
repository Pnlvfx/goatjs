import type { PathLike } from 'node:fs';
import { readdir, access, rm } from 'node:fs/promises';
import { isJunk } from './junk.js';
import path from 'node:path';

interface ReaddirOptions {
  /** @default true */
  junk?: boolean;
}

export const fsExtra = {
  readdir: async (path: PathLike, { junk = true }: ReaddirOptions = {}) => {
    const files = await readdir(path);
    return junk ? files.filter((f) => !isJunk(f)) : files;
  },
  exist: async (path: PathLike, mode?: number) => {
    try {
      await access(path, mode);
      return true;
    } catch {
      return false;
    }
  },
  isFsError: (error: unknown): error is NodeJS.ErrnoException => {
    return error instanceof Error && 'code' in error && typeof error.code === 'string';
  },
  clearFolder: async (folder: string) => {
    const contents = await readdir(folder);
    for (const content of contents) {
      await rm(path.join(folder, content));
    }
  },
};
