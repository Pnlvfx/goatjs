import type { IndexSpecification } from './patched-types.js';
import { type CollectionOptions, type CreateIndexesOptions, type DbOptions, MongoClient, type MongoClientOptions } from 'mongodb';

type Document = object;

export const createGoatClient = (url: string, options?: MongoClientOptions) => {
  const client = new MongoClient(url, options);

  const createDb = (dbName: string, options?: DbOptions) => {
    const db = client.db(dbName, options);

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
    const createCollection = <T extends Document>(name: string, options?: CollectionOptions) => {
      const collection = db.collection<T>(name, options);

      return {
        createIndex: <K extends keyof T & string>(indexSpec: IndexSpecification<K>, options?: CreateIndexesOptions) => {
          return collection.createIndex(indexSpec, options);
        },
      };
    };

    return {
      collection: createCollection,
    };
  };

  return {
    connect: () => client.connect(),
    db: createDb,
  };
};

export type { WithId } from 'mongodb';
