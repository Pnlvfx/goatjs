import { MongoClient, type DbOptions, type GoatClientOptions } from './patched-types.js';
import { createGoatDb } from './db.js';

export const createGoatClient = (url: string, options?: GoatClientOptions) => {
  const client = new MongoClient(url, { forceServerObjectId: false, ignoreUndefined: true, ...options });

  return {
    db: (dbName: string, options?: DbOptions) => {
      const db = client.db(dbName, options);
      return createGoatDb(db);
    },
    close: () => client.close(),
  };
};

export type { Db } from './db.js';
export type * from './patched-types.js';
export * from './projection.js';
