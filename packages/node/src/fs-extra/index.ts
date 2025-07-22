import type { ObjectEncodingOptions, PathLike } from 'node:fs';
import { readdir, access, rm } from 'node:fs/promises';
import { isJunk } from './junk.js';
import path from 'node:path';

interface Implemented {
  /** @default true */
  junk?: boolean;
}

type ReaddirOptions = (ObjectEncodingOptions & { withFileTypes?: false; recursive?: boolean } & Implemented) | BufferEncoding | null;

// FS USE FUNCTION OVERLOAD AND IT'S NOT EASY TO WRAP.

export const fsExtra = {
  readdir: async (path: PathLike, options: ReaddirOptions = {}) => {
    const junk = !!(typeof options !== 'string' && options?.junk);
    const files = await readdir(path, options);
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
