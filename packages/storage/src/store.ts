import type * as z from 'zod';
import { storage } from './storage.ts';
import { createStore as createStoreCore } from '@goatjs/node/store';

export interface StoreParams<T extends z.ZodType> {
  root?: string;
  initial?: z.infer<T>;
}

/** This mimic the browser localStorage and allow you to store primitives on disk. */
export const createStore = async <T extends z.ZodType>(name: string, schema: T, { root: baseRoot, initial }: StoreParams<T> = {}) => {
  const base = baseRoot ?? (await storage.use('store'));
  return createStoreCore(name, schema, { directory: base, initial });
};
