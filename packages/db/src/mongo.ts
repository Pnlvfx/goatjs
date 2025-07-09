import type { GoatClientOptions } from './patched-types.js';
import { createGoatDb } from './db.js';
import { MongoClient, type DbOptions } from 'mongodb';

// TODO we might consider add an eslint rule to disallow native mongo in all projects and use this

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

export { ObjectId } from 'mongodb';
export type * from './patched-types.js';
export type { Db } from './db.js';
