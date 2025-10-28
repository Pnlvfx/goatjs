/* eslint-disable @typescript-eslint/no-dynamic-delete */
import type { Callback } from '@goatjs/core/types';
import { storage } from '@goatjs/storage';
import path from 'node:path';
import fs from 'node:fs/promises';
import { createStore } from '@goatjs/storage/store';

interface Options<T> {
  key?: string;
  expires?: number;
  persist?: boolean;
  type: 'json' | 'xml' | 'html';
  callback: Callback<T>;
}

interface CacheData<T> {
  timestamp: number;
  data: T;
  persist?: boolean;
  key?: string;
}

interface CacheStore {
  id: string;
  key: string;
  timestamp: number;
  filename: string;
  type: 'json' | 'xml' | 'html';
}

export const createCacheKey = async <T>(name: string, { expires, key, persist, type, callback }: Options<T>) => {
  const cacheDir = await storage.use('cache');
  const store = await createStore<CacheStore>('cache');
  const caches: Record<string, CacheData<unknown>> = {};

  const dataFileName = `${name}.${type}`;
  const dataFilePath = path.join(cacheDir, dataFileName);

  // we're trying to separate the data from the cache data to allow other than json files like xml ecc
  // but they require different file extension so first seaprate them then we have to retrieve the data from the store config
  // and serve it from the stored file

  const getStored = async () => {
    const metadata = await store.get();
    if (!metadata) return;
    const buf = await fs.readFile(dataFilePath);
    const data = type === 'json' ? (JSON.parse(buf.toString()) as CacheData<T>) : buf.toString();
    return {
      data,
      timestamp: metadata.timestamp,
      persist: true,
      key: metadata.key,
    };
  };

  const storeFile = async (data: T, timestamp: number) => {
    await store.set({ id: name, key, timestamp, filename: dataFileName, type });
    await fs.writeFile(dataFilePath, type === 'json' ? JSON.stringify(data) : (data as string));
  };

  return {
    query: async (): Promise<T> => {
      const saved = persist ? await getStored() : caches[name];
      const currentTime = Date.now();

      if (!saved || key !== saved.key || (expires && currentTime - saved.timestamp > expires)) {
        const data = await callback();
        const cacheData = {
          data,
          timestamp: currentTime,
          persist,
          key,
        };
        caches[name] = cacheData;

        if (persist) {
          await storeFile(data, currentTime);
        }

        return data;
      }

      return saved.data as T;
    },
    invalidate: async () => {
      await fs.rm(path.join(cacheDir, `${name}.json`));
      await store.clear();
      delete caches[name];
    },
  };
};
