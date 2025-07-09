import type { FilterOperators, IndexDirection, MongoClientOptions, RootFilterOperators } from 'mongodb';

export type GoatClientOptions = Omit<MongoClientOptions, 'forceServerObjectId' | 'ignoreUndefined'>;

export type Condition<T> = T | FilterOperators<T>;

/** A MongoDB filter can be some portion of the schema or a set of operators @public */
export type GoatFilter<T> = {
  [P in keyof T]?: Condition<T[P]>;
} & RootFilterOperators<T>;

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export type GoatIndexSpecification<T extends string> = T | [T, IndexDirection] | { [K in T]?: IndexDirection };
