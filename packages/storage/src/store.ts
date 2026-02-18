/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import type * as z from 'zod';
import { storage } from './storage.ts';
import fs from 'node:fs/promises';
import path from 'node:path';

export interface StoreParams<T extends z.ZodType> {
  root?: string;
  initial?: z.infer<T>;
}

/** This mimic the browser localStorage and allow you to store primitives on disk. */
export const createStore = async <T extends z.ZodType>(name: string, schema: T, { root: baseRoot, initial }: StoreParams<T> = {}) => {
  type StoreType = z.infer<T>;
  const base = baseRoot ?? (await storage.use('store'));
  const configFile = path.join(base, `${name}.json`);
  let currentConfig: StoreType | undefined;

  const getBuffer = async () => {
    try {
      return await fs.readFile(configFile);
    } catch {
      // eslint-disable-next-line unicorn/no-useless-undefined
      return undefined;
    }
  };

  const get = async () => {
    if (!currentConfig) {
      const buf = await getBuffer();
      if (!buf) return;
      currentConfig = JSON.parse(buf.toString()) as StoreType;
    }

    return currentConfig;
  };

  const set = async (configs: Partial<StoreType>) => {
    const update = currentConfig ? { ...currentConfig, ...configs } : configs;
    currentConfig = await schema.parseAsync(update);
    await fs.writeFile(configFile, JSON.stringify(currentConfig));
  };

  if (initial) {
    const stored = await get();
    if (!stored) {
      await set(initial);
    }
  }

  return {
    get,
    set,
    clear: async () => {
      try {
        await fs.rm(configFile);
      } catch {}
      currentConfig = undefined;
    },
  };
};
