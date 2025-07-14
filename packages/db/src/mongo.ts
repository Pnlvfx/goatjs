import type { DbOptions, GoatClientOptions } from './override/types.js';
import { createGoatDb } from './db.js';
import { MongoClient } from './override/proto.js';

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
export type * from './override/types.js';
export * from './override/proto.js';
export * from './projection.js';
