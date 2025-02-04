import type { IndexDirection, MongoClientOptions, OneOrMore } from 'mongodb';

export type GoatClientOptions = Omit<MongoClientOptions, 'forceServerObjectId'>;

// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export type GoatIndexSpecification<T extends string> = OneOrMore<T | [T, IndexDirection] | { [K in T]: IndexDirection }>;
