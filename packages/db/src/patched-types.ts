/* eslint-disable no-restricted-imports */
import type {
  FilterOperators,
  IndexDirection,
  MongoClientOptions,
  RootFilterOperators,
  DbOptions as MongoDbOptions,
  FindOptions,
  Abortable,
} from 'mongodb';

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

export type FindOneOptions = Omit<FindOptions, 'timeoutMode'> & Abortable;
