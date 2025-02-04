/* eslint-disable unicorn/no-array-method-this-argument */
/* eslint-disable unicorn/no-array-callback-reference */
import type { GoatClientOptions, GoatIndexSpecification, GoatDocument } from './patched-types.js';
import {
  type CollectionOptions,
  type CreateIndexesOptions,
  type DbOptions,
  type IndexSpecification,
  MongoClient,
  type Filter,
  type FindOptions,
  type Abortable,
  type OptionalUnlessRequiredId,
  type BulkWriteOptions,
  InsertOneOptions,
} from 'mongodb';

export const createGoatClient = (url: string, options?: GoatClientOptions) => {
  const client = new MongoClient(url, { forceServerObjectId: false, ...options });

  const createDb = (dbName: string, options?: DbOptions) => {
    const db = client.db(dbName, options);

    const createCollection = <K, T extends GoatDocument<K>>(name: string, options?: CollectionOptions) => {
      const collection = db.collection<T>(name, options);

      return {
        createIndex: (indexSpec: GoatIndexSpecification<keyof T & string>, options?: CreateIndexesOptions) => {
          return collection.createIndex(indexSpec as unknown as IndexSpecification, options);
        },
        // @TODO
        find: (filter: Filter<T>, options?: FindOptions & Abortable) => {
          return collection.find(filter, options);
        },
        // @TODO
        findOne: (filter: Filter<T>, options?: Omit<FindOptions, 'timeoutMode'> & Abortable) => {
          return collection.findOne(filter, options);
        },
        // @TODO
        insertOne: (doc: T, options?: InsertOneOptions) => {
          return collection.insertOne(doc as unknown as OptionalUnlessRequiredId<T>, options);
        },
        // @TODO
        insertMany: (docs: readonly OptionalUnlessRequiredId<T>[], options?: BulkWriteOptions) => {
          return collection.insertMany(docs, options);
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

export type * from './patched-types.js';
