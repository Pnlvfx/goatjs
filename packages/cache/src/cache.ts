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
  debug?: boolean;
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

export const createCacheKey = async <T>(name: string, { expires, key, persist, type, debug, callback }: Options<T>) => {
  const cacheDir = await storage.use('cache');
  const store = await createStore<CacheStore>('cache');
  const caches: Record<string, CacheData<unknown>> = {};
  const dataFileName = `${name}.${type}`;
  const dataFilePath = path.join(cacheDir, dataFileName);

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
      if (debug) {
        // eslint-disable-next-line no-console
        console.log('querying', name);
      }
      const saved = caches[name] ?? (persist ? await getStored() : undefined);
      const currentTime = Date.now();

      if (!saved || key !== saved.key || (expires && currentTime - saved.timestamp > expires)) {
        if (debug) {
          // eslint-disable-next-line no-console
          console.log('CACHE MISS');
        }
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
      } else {
        if (debug) {
          // eslint-disable-next-line no-console
          console.log('CACHE HIT');
        }
        return saved.data as T;
      }
    },
    invalidate: async () => {
      await fs.rm(path.join(cacheDir, `${name}.json`));
      await store.clear();
      delete caches[name];
    },
  };
};
