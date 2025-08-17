import type { BulkWriteOptions, CollectionOptions, Db, InsertOneOptions } from '../mongo.js';
import * as z from 'zod';

// TODO [2025-08-31] we have a problem validating the objectID, we should try one of this solutions

// const mongoObjectId = z.string().refine((val) => ObjectId.isValid(val));
// const mongoObjectId = z.string().transform((val) => new ObjectId(val));

/** Thinked to integrate zod on the existing implementation but we have to recreate the whole wrapper duo to how is nested
 * actually I'm boring, but it will be really cool to do, and we should do it, wrap insertOne, insertMany ecc with this schema.
 * use
 */
export const createExperimentalGoatDb = (db: Db) => {
  const createCollection = <Z extends z.ZodObject>(name: string, schema: Z, options: CollectionOptions) => {
    type T = z.infer<Z>;
    /** @ts-expect-error zod will check for the _id. */
    const { insertOne, insertMany, ...collection } = db.collection<T>(name, options);

    return {
      ...collection,
      insertOne: async (doc: T, options?: InsertOneOptions) => {
        const parsed = await schema.parseAsync(doc);
        await insertOne(parsed, options);
      },
      insertMany: async (docs: readonly z.core.output<Z>[], options?: BulkWriteOptions) => {
        const parsed = await schema.array().parseAsync(docs);
        await insertMany(parsed, options);
      },
    };
  };

  return { createCollection };
};
