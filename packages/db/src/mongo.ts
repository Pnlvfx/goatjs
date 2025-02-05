/* eslint-disable unicorn/no-array-method-this-argument */
/* eslint-disable unicorn/no-array-callback-reference */
import type { GoatClientOptions, GoatIndexSpecification } from './patched-types.js';
import {
  MongoClient,
  type CollectionOptions,
  type CreateIndexesOptions,
  type DbOptions,
  type Filter,
  type FindOptions,
  type Abortable,
  type OptionalUnlessRequiredId,
  type BulkWriteOptions,
  type InsertOneOptions,
  type AggregateOptions,
  type FindCursor,
} from 'mongodb';

export const createGoatClient = (url: string, options?: GoatClientOptions) => {
  const client = new MongoClient(url, { forceServerObjectId: false, ...options });

  const createDb = (dbName: string, options?: DbOptions) => {
    const db = client.db(dbName, options);

    const createCollection = <T extends { _id: unknown }>(name: string, options?: CollectionOptions) => {
      const collection = db.collection<T>(name, options);

      /** @ts-expect-error Removing the WithId from the return. */
      function find(): FindCursor<T>;
      function find(filter: Filter<T>, options?: FindOptions & Abortable): FindCursor<T>;
      function find<U extends Document>(filter: Filter<T>, options?: FindOptions & Abortable): FindCursor<U>;
      function find(filter?: Filter<T>, options?: FindOptions & Abortable) {
        return collection.find(filter as unknown as Filter<T>, options);
      }

      return {
        /**
         * Creates an index on the db and collection collection.
         *
         * @param indexSpec - The field name or index specification to create an index for
         * @param options - Optional settings for the command
         *
         * @example
         * ```ts
         * const collection = client.db('foo').collection('bar');
         *
         * await collection.createIndex({ a: 1, b: -1 });
         *
         * // Alternate syntax for { c: 1, d: -1 } that ensures order of indexes
         * await collection.createIndex([ [c, 1], [d, -1] ]);
         *
         * // Equivalent to { e: 1 }
         * await collection.createIndex('e');
         *
         * // Equivalent to { f: 1, g: 1 }
         * await collection.createIndex(['f', 'g'])
         *
         * // Equivalent to { h: 1, i: -1 }
         * await collection.createIndex([ { h: 1 }, { i: -1 } ]);
         *
         * // Equivalent to { j: 1, k: -1, l: 2d }
         * await collection.createIndex(['j', ['k', -1], { l: '2d' }])
         * ```
         */
        createIndex: (indexSpec: GoatIndexSpecification<Exclude<keyof T & string, '_id'>>, options?: CreateIndexesOptions) => {
          /** @ts-expect-error the types are different but they are working. */
          return collection.createIndex(indexSpec, options);
        },
        find,
        // @TODO
        findOne: (filter: Filter<T>, options?: Omit<FindOptions, 'timeoutMode'> & Abortable) => {
          return collection.findOne(filter, options);
        },
        // @TODO
        insertOne: (doc: T, options?: InsertOneOptions) => {
          return collection.insertOne(doc as unknown as OptionalUnlessRequiredId<T>, options);
        },
        // @TODO
        insertMany: (docs: readonly T[], options?: BulkWriteOptions) => {
          return collection.insertMany(docs as unknown as OptionalUnlessRequiredId<T>[], options);
        },
        // @TODO
        aggregate: (pipeline: T[], options?: AggregateOptions & Abortable) => {
          return collection.aggregate<T>(pipeline, options);
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
