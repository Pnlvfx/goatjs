/* eslint-disable unicorn/no-array-method-this-argument */
/* eslint-disable unicorn/no-array-callback-reference */
import type { IndexSpecification } from './patched-types.js';
import {
  type CollectionOptions,
  type CreateIndexesOptions,
  type DbOptions,
  type IndexSpecification as MongoIndexSpecification,
  MongoClient,
  type MongoClientOptions,
  type Filter,
  type FindOptions,
  type Abortable,
  type OptionalUnlessRequiredId,
  type BulkWriteOptions,
  InsertOneOptions,
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
        // @TODO
        find: (filter: Filter<T>, options?: FindOptions & Abortable) => {
          return collection.find(filter, options);
        },
        // @TODO
        findOne: (filter: Filter<T>, options?: Omit<FindOptions, 'timeoutMode'> & Abortable) => {
          return collection.findOne(filter, options);
        },
        // @TODO
        insertOne: (doc: OptionalUnlessRequiredId<T>, options?: InsertOneOptions) => {
          return collection.insertOne(doc, options);
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

export type { WithId } from 'mongodb';
export type * from './patched-types.js';
