import fs from 'node:fs/promises';
import path from 'node:path';
import { storage } from './storage.js';

const projectRoot = await storage.use('store');
// await fs.rm(projectRoot, { recursive: true, force: true });

/** This mimic the browser localStorage and allow you to store
 * primitives on disk.
 */
export const createStore = async <T extends object>(name: string) => {
  const root = path.join(projectRoot, name);

  try {
    await fs.mkdir(root);
  } catch {}

  const configFile = path.join(root, 'configs.json');

  let currentConfig: T | undefined;

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
        currentConfig = JSON.parse(buf.toString()) as T;
      }
      return currentConfig;
    },
    set: async (configs: Partial<T>) => {
      /** @ts-expect-error typescript doesn't like this but I think it's fine but it's true that it's not typesafe. */
      currentConfig = currentConfig ? { ...currentConfig, ...configs } : configs;
      await fs.writeFile(configFile, JSON.stringify(currentConfig));
    },
    clear: async () => {
      await fs.rm(configFile);
    },
  };
};
