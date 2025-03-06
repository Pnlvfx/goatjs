/* eslint-disable unicorn/no-array-method-this-argument */
/* eslint-disable unicorn/no-array-callback-reference */
import type { GoatClientOptions, GoatFilter, GoatIndexSpecification } from './patched-types.js';
import {
  MongoClient,
  type CollectionOptions,
  type CreateIndexesOptions,
  type DbOptions,
  type FindOptions,
  type Abortable,
  type BulkWriteOptions,
  type InsertOneOptions,
  type AggregateOptions,
  type FindCursor,
  type FindOneAndUpdateOptions,
  type UpdateFilter,
  type ModifyResult,
  type UpdateOptions,
  type DeleteOptions,
  type Document,
  type DropIndexesOptions,
} from 'mongodb';

export const createGoatClient = (url: string, options?: GoatClientOptions) => {
  const client = new MongoClient(url, { forceServerObjectId: false, ...options });

  const createDb = (dbName: string, options?: DbOptions) => {
    const db = client.db(dbName, options);

    const createCollection = <T extends { _id: unknown }>(name: string, options?: CollectionOptions) => {
      const collection = db.collection<T>(name, options);

      /** @ts-expect-error removing the WithId interface from the return. */
      function find(): FindCursor<T>;
      function find(filter: GoatFilter<T>, options?: FindOptions & Abortable): FindCursor<T>;
      function find<U extends T>(filter: GoatFilter<U>, options?: FindOptions & Abortable): FindCursor<T>;
      function find(filter?: GoatFilter<T>, options?: FindOptions & Abortable) {
        /** @ts-expect-error typescript see that we removed the interface. */
        return collection.find(filter, options);
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
        findOne(filter?: GoatFilter<T>, options?: Omit<FindOptions, 'timeoutMode'> & Abortable): Promise<T | null> {
          /** @ts-expect-error Removing WithId from the return type */
          return collection.findOne(filter, options);
        },
        findOneAndUpdate: <B extends boolean>(
          filter: GoatFilter<T>,
          update: UpdateFilter<T>,
          options?: FindOneAndUpdateOptions & { includeResultMetadata: B },
        ): Promise<B extends true ? ModifyResult<T> : T | null> => {
          /** @ts-expect-error Removing WithId from the return type */
          return collection.findOneAndUpdate(filter, update, options);
        },
        insertOne: (doc: T, options?: InsertOneOptions) => {
          /** @ts-expect-error types are differents. */
          return collection.insertOne(doc, options);
        },
        insertMany: (docs: readonly T[], options?: BulkWriteOptions) => {
          /** @ts-expect-error types are differents. */
          return collection.insertMany(docs, options);
        },
        updateOne: (filter: GoatFilter<T>, update: UpdateFilter<T> | Document[], options?: UpdateOptions) => {
          /** @ts-expect-error types are differents. */
          return collection.updateOne(filter, update, options);
        },
        deleteMany: (filter?: GoatFilter<T>, options?: DeleteOptions) => {
          /** @ts-expect-error types are differents. */
          return collection.deleteMany(filter, options);
        },
        aggregate: <Agg extends Document>(pipeline: GoatFilter<T>[], options?: AggregateOptions & Abortable) => {
          return collection.aggregate<Agg>(pipeline, options);
        },
        dropIndexes: (options: DropIndexesOptions = {}) => collection.dropIndexes(options),
      };
    };

    return { collection: createCollection };
  };

  return { db: createDb };
};

export { ObjectId } from 'mongodb';
export type * from './patched-types.js';
