import type { IndexSpecification } from './patched-types.js';
import {
  type CollectionOptions,
  type CreateIndexesOptions,
  type DbOptions,
  type IndexSpecification as MongoIndexSpecification,
  MongoClient,
  type MongoClientOptions,
} from 'mongodb';

type Document = object;

export const createGoatClient = (url: string, options?: MongoClientOptions) => {
  const client = new MongoClient(url, options);

  const createDb = (dbName: string, options?: DbOptions) => {
    const db = client.db(dbName, options);

    const createCollection = <T extends Document>(name: string, options?: CollectionOptions) => {
      const collection = db.collection<T>(name, options);

      return {
        createIndex: (indexSpec: IndexSpecification<keyof T & string>, options?: CreateIndexesOptions) => {
          return collection.createIndex(indexSpec as unknown as MongoIndexSpecification, options);
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
export type * from './patched-types.js';
