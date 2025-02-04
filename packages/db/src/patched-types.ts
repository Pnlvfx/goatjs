import type { IndexDirection, MongoClientOptions } from 'mongodb';

export type GoatClientOptions = Omit<MongoClientOptions, 'forceServerObjectId'>;

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export type GoatIndexSpecification<T extends string> = T | [T, IndexDirection] | { [K in T]: IndexDirection };
