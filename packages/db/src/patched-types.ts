/* eslint-disable no-restricted-imports */
import type {
  FilterOperators,
  IndexDirection,
  MongoClientOptions,
  RootFilterOperators,
  DbOptions as MongoDbOptions,
  FindOptions as MongoFindOptions,
  Abortable,
  FindCursor as MongoFindCursor,
} from 'mongodb';
import type { ProjectedType, ProjectionKeys } from './projection.js';

type Omitted = 'forceServerObjectId' | 'ignoreUndefined';
export type GoatClientOptions = Omit<MongoClientOptions, Omitted>;
export type DbOptions = Omit<MongoDbOptions, Omitted>;

export type Condition<T> = T | FilterOperators<T>;

/** A MongoDB filter can be some portion of the schema or a set of operators @public */
export type Filter<T> = {
  [P in keyof T]?: Condition<T[P]>;
} & RootFilterOperators<T>;

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export type IndexSpecification<T extends string> = T | [T, IndexDirection] | { [K in T]?: IndexDirection };

export type FindOptions = Omit<MongoFindOptions, 'projection'>;
export type FindOneOptions = Omit<MongoFindOptions, 'timeoutMode'> & Abortable;

// re exporting the mongo types as we should not directly use them through the project.
// this file is the only one allowed to import from mongodb lib.

export { ObjectId, MongoClient } from 'mongodb';
export type {
  Abortable,
  AnyBulkWriteOperation,
  BulkWriteOptions,
  CollectionOptions,
  CountDocumentsOptions,
  CreateIndexesOptions,
  Db as MongoDb,
  DeleteOptions,
  DropIndexesOptions,
  FindCursor,
  FindOneAndUpdateOptions,
  InsertOneOptions,
  ModifyResult,
  UpdateFilter,
  UpdateOptions,
  Sort,
  AggregateOptions,
  Document,
} from 'mongodb';
