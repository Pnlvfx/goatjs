import { createGoatClient, type DbOptions, type GoatClientOptions } from '../mongo.js';
import { createExperimentalGoatDb } from './db.js';

export const createExperimentalGoatClient = (url: string, options?: GoatClientOptions) => {
  const client = createGoatClient(url, options);

  return {
    db: (dbName: string, options?: DbOptions) => {
      const db = client.db(dbName, options);
      return createExperimentalGoatDb(db);
    },
    close: () => client.close(),
  };
};
