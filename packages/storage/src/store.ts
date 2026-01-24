/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import type * as z from 'zod';
import fs from 'node:fs/promises';
import path from 'node:path';
import { storage } from './storage.js';

const projectRoot = await storage.use('store');

/** This mimic the browser localStorage and allow you to store
 *  primitives on disk.
 */
export const createStore = async <T extends z.ZodType>(name: string, schema: T) => {
  type StoreType = z.infer<T>;
  const root = path.join(projectRoot, name);

  try {
    await fs.mkdir(root);
  } catch {}

  const configFile = path.join(root, 'configs.json');

  let currentConfig: StoreType | undefined;

  const getBuffer = async () => {
    try {
      return await fs.readFile(configFile);
    } catch {
      // eslint-disable-next-line unicorn/no-useless-undefined
      return undefined;
    }
  };

  return {
    get: async () => {
      if (!currentConfig) {
        const buf = await getBuffer();
        if (!buf) return;
        currentConfig = JSON.parse(buf.toString()) as StoreType;
      }

      return currentConfig;
    },
    set: async (configs: Partial<StoreType>) => {
      const update = currentConfig ? { ...currentConfig, ...configs } : configs;
      currentConfig = await schema.parseAsync(update);
      await fs.writeFile(configFile, JSON.stringify(currentConfig));
    },
    clear: async () => {
      try {
        await fs.rm(configFile);
      } catch {}
      currentConfig = undefined;
    },
  };
};
