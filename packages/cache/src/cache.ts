/* eslint-disable @typescript-eslint/no-dynamic-delete */
import type { Callback } from '@goatjs/core/types/callback';
import { storage } from '@goatjs/storage';
import { createStore } from '@goatjs/storage/store';
import path from 'node:path';
import fs from 'node:fs/promises';
import { hasSameKeys } from './key.js';

export interface CacheOptions<T, P extends unknown[]> {
  keys: string[];
  expiresIn?: number;
  persist?: boolean;
  type: 'json' | 'xml' | 'html';
  fn: Callback<T, P>;
  debug?: boolean;
}

export interface CacheData<T> {
  timestamp: number;
  data: T;
  persist?: boolean;
  keys: string[];
}

interface CacheStore {
  id: string;
  keys: string[];
  timestamp: number;
  type: 'json' | 'xml' | 'html';
}

export const createCacheKey = async <T, P extends unknown[]>(name: string, { expiresIn, keys, persist, type, debug, fn }: CacheOptions<T, P>) => {
  const cacheDir = await storage.use('cached');
  const store = await createStore<CacheStore>('cache');
  const caches: Record<string, CacheData<T>> = {};

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
      keys: metadata.keys,
    };
  };

  const storeFile = async (data: T, timestamp: number) => {
    await store.set({ id: name, keys, timestamp, type });
    await fs.writeFile(dataFilePath, type === 'json' ? JSON.stringify(data) : (data as string));
  };

  return {
    query: async (...params: P): Promise<T> => {
      if (debug) {
        // eslint-disable-next-line no-console
        console.log('querying', name);
      }
      const saved = caches[name] ?? (persist ? await getStored() : undefined);
      const currentTime = Date.now();

      if (!saved || !hasSameKeys(keys, saved.keys) || (expiresIn !== undefined && currentTime - saved.timestamp > expiresIn)) {
        if (debug) {
          // eslint-disable-next-line no-console
          console.log('CACHE MISS');
        }
        const data = await fn(...params);
        const cacheData = {
          data,
          timestamp: currentTime,
          persist,
          keys,
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
      delete caches[name];
      try {
        await fs.rm(dataFilePath);
      } catch {}
      await store.clear();
    },
  };
};
