/* eslint-disable @typescript-eslint/no-dynamic-delete */
import type { Callback } from '../../coraline/src/types.js';
import fs from 'node:fs/promises';
import path from 'node:path';

interface CacheData<T> {
  timestamp: number;
  data: T;
  isStored: boolean;
  customId?: string;
}

const cacheDir = await storage.use('cache');
const caches: Partial<Record<string, CacheData<unknown>>> = {};

const getStored = async <T>(name: string) => {
  try {
    const file = path.join(cacheDir, `${name}.json`);
    const buf = await fs.readFile(file);
    return JSON.parse(buf.toString()) as CacheData<T>;
  } catch {
    return;
  }
};

const store = async <T>(cache: CacheData<T>, name: string) => {
  const file = path.join(cacheDir, `${name}.json`);
  await fs.writeFile(file, JSON.stringify(cache));
};

export const cache = {
  use: async <T>(name: string, callback: Callback<T>, options?: { customId?: string; expires?: number; store?: boolean }): Promise<T> => {
    const saved = options?.store ? await getStored(name) : caches[name];
    const currentTime = Date.now();

    if (!saved || options?.customId !== saved.customId || (options?.expires && currentTime - saved.timestamp > options.expires)) {
      const cacheNew = {
        data: await callback(),
        timestamp: currentTime,
        isStored: options?.store ?? false,
      };
      caches[name] = cacheNew;

      if (options?.store) {
        await store(cacheNew, name);
      }
      return cacheNew.data;
    }

    return saved.data as T;
  },
  clear: async (name: string) => {
    await fs.rm(path.join(cacheDir, `${name}.json`));
    delete caches[name];
  },
  clearAll: () => {
    for (const [key] of Object.entries(caches)) {
      delete caches[key];
    }
    return fs.rm(cacheDir);
  },
};
