/* eslint-disable unicorn/no-array-method-this-argument */
/* eslint-disable unicorn/no-array-callback-reference */
import type { GoatClientOptions, GoatIndexSpecification } from './patched-types.js';
import {
  type CollectionOptions,
  type CreateIndexesOptions,
  type DbOptions,
  MongoClient,
  type Filter,
  type FindOptions,
  type Abortable,
  type OptionalUnlessRequiredId,
  type BulkWriteOptions,
  type InsertOneOptions,
  AggregateOptions,
} from 'mongodb';

export const createGoatClient = (url: string, options?: GoatClientOptions) => {
  const client = new MongoClient(url, { forceServerObjectId: false, ...options });

  const createDb = (dbName: string, options?: DbOptions) => {
    const db = client.db(dbName, options);

    const createCollection = <T extends { _id: unknown }>(name: string, options?: CollectionOptions) => {
      const collection = db.collection<T>(name, options);

      return {
        createIndex: (indexSpec: GoatIndexSpecification<Exclude<keyof T & string, '_id'>>, options?: CreateIndexesOptions) => {
          /** @ts-expect-error the types are different but they are working. */
          return collection.createIndex(indexSpec, options);
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
        // @TODO
        aggregate: (pipeline: Document[], options?: AggregateOptions & Abortable) => {
          return collection.aggregate(pipeline, options);
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

export { ObjectId } from 'mongodb';
export type * from './patched-types.js';
