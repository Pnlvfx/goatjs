// /* eslint-disable @typescript-eslint/no-dynamic-delete */
// import type { Callback } from '@goatjs/core/types';
// import { storage } from '@goatjs/storage';
// import path from 'node:path';
// import fs from 'node:fs/promises';
// import { createStore } from '@goatjs/storage/store';

// TODO [2025-11-11] end this

// interface Options<T> {
//   key?: string;
//   expires?: number;
//   persist?: boolean;
//   type: 'json' | 'xml' | 'html';
//   callback: Callback<T>;
// }

// interface CacheData<T> {
//   timestamp: number;
//   data: T;
//   persist?: boolean;
//   key?: string;
// }

// interface CacheStore {
//     id: string;
//     key: string;
//   timestamp: number;
//   filename: string;
// }

// export const createCacheKey = async <T>(name: string, { expires, key, persist, type, callback }: Options<T>) => {
//   const cacheDir = await storage.use('cache');
//   const store = await createStore<CacheStore>('cache');
//   const caches: Record<string, CacheData<unknown>> = {};

//   // we're trying to separate the data from the cache data to allow other than json files like xml ecc
//   // but they require different file extension so first seaprate them then we have to retrieve the data from the store config
//   // and serve it from the stored file

//   const getStored = async <T>() => {
//     try {
//       const file = path.join(cacheDir, `${name}.json`);
//       const buf = await fs.readFile(file);
//       return JSON.parse(buf.toString()) as CacheData<T>;
//     } catch {
//       return;
//     }
//   };

//   const storeFile = async <T>(cache: CacheData<T>) => {
//     const file = path.join(cacheDir, `${name}.json`);
//     await fs.writeFile(file, JSON.stringify(cache));
//   };

//   return {
//     query: async (): Promise<T> => {
//       const saved = persist ? await getStored() : caches[name];
//       const currentTime = Date.now();

//       if (!saved || key !== saved.key || (expires && currentTime - saved.timestamp > expires)) {
//         const data = await callback();
//         await store.set({filename: , timestamp: currentTime});
//         const cacheData = {
//           data: await callback(),
//           timestamp: currentTime,
//           isStored: persist
//         };
//         caches[name] = cacheData;

//         if (persist) {
//           await storeFile(cacheData);
//         }

//         return cacheData.data;
//       }

//       return saved.data as T;
//     },
//     invalidate: async () => {
//       await fs.rm(path.join(cacheDir, `${name}.json`));
//       delete caches[name];
//     },
//   };
// };
// eslint-disable-next-line unicorn/no-empty-file
