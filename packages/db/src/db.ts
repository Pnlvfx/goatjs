/* eslint-disable unicorn/no-array-method-this-argument */
/* eslint-disable unicorn/no-array-callback-reference */
import type {
  Abortable,
  AnyBulkWriteOperation,
  BulkWriteOptions,
  CollectionOptions,
  CountDocumentsOptions,
  CreateIndexesOptions,
  MongoDb,
  DeleteOptions,
  DropIndexesOptions,
  FindCursor,
  FindOneAndUpdateOptions,
  FindOptions,
  InsertOneOptions,
  ModifyResult,
  UpdateFilter,
  UpdateOptions,
  Sort,
  AggregateOptions,
  Document,
} from './patched-types.js';
import type { Filter, FindOneOptions, IndexSpecification } from './patched-types.js';
import type { ProjectedType, ProjectionKeys } from './projection.js';

export const createGoatDb = (db: MongoDb) => {
  const createCollection = <T extends { _id: unknown }>(name: string, options?: CollectionOptions) => {
    const collection = db.collection<T>(name, options);

    function find(): FindCursor<T>;
    function find(filter: Filter<T>, options?: FindOptions & Abortable): FindCursor<T>;
    function find<U extends T>(filter: Filter<U>, options?: FindOptions & Abortable): FindCursor<T>;
    function find(filter?: Filter<T>, options?: FindOptions & Abortable) {
      /** @ts-expect-error typescript see that we removed the interface. */
      const result = collection.find(filter, options);
      return result as FindCursor<T> & {
        project<P extends ProjectionKeys<T>>(projection: P): FindCursor<ProjectedType<T, P>>;
      };
    }

    function findOne<P extends ProjectionKeys<T>>(
      filter: Filter<T>,
      options: Omit<FindOneOptions, 'projection'> & { projection: P },
    ): Promise<ProjectedType<T, P> | null>;
    function findOne(filter?: Filter<T>, options?: FindOneOptions): Promise<T | null>;
    function findOne<P extends ProjectionKeys<T>>(
      filter?: Filter<T>,
      options?: FindOneOptions | (Omit<FindOneOptions, 'projection'> & { projection: P }),
    ): Promise<T | ProjectedType<T, P> | null> {
      /** @ts-expect-error Removing WithId from the return type */
      return collection.findOne(filter, options);
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
      createIndex: (indexSpec: IndexSpecification<Exclude<keyof T & string, '_id'>>, options?: CreateIndexesOptions) => {
        /** @ts-expect-error the types are different but they are working. */
        return collection.createIndex(indexSpec, options);
      },
      countDocuments: (filter?: Filter<T>, options?: CountDocumentsOptions & Abortable) => {
        /** @ts-expect-error Filter diff */
        return collection.countDocuments(filter, options);
      },
      find,
      findOne,
      findOneAndUpdate: <B extends boolean = false>(
        filter: Filter<T>,
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
      updateOne: (filter: Filter<T>, update: UpdateFilter<T> | Document[], options?: UpdateOptions & { sort?: Sort }) => {
        /** @ts-expect-error types are differents. */
        return collection.updateOne(filter, update, options);
      },
      updateMany: (filter: Filter<T>, update: UpdateFilter<T> | Document[], options?: UpdateOptions) => {
        /** @ts-expect-error types are differents. */
        return collection.updateMany(filter, update, options);
      },
      deleteOne: (filter?: Filter<T>, options?: DeleteOptions) => {
        /** @ts-expect-error types are differents. */
        return collection.deleteOne(filter, options);
      },
      deleteMany: (filter?: Filter<T>, options?: DeleteOptions) => {
        /** @ts-expect-error types are differents. */
        return collection.deleteMany(filter, options);
      },
      aggregate: <Agg extends Document>(pipeline: Filter<T>[], options?: AggregateOptions & Abortable) => {
        return collection.aggregate<Agg>(pipeline, options);
      },
      bulkWrite: (operations: readonly AnyBulkWriteOperation<T>[], options?: BulkWriteOptions) => {
        return collection.bulkWrite(operations, options);
      },
      dropIndexes: (options: DropIndexesOptions = {}) => collection.dropIndexes(options),
    };
  };

  return { collection: createCollection };
};

export type Db = ReturnType<typeof createGoatDb>;
