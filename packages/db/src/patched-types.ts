import type { IndexDirection, MongoClientOptions, OneOrMore } from 'mongodb';

export type GoatDocument<T> = { _id: T } & object;

export type GoatClientOptions = Omit<MongoClientOptions, 'forceServerObjectId'>;

export type GoatIndexSpecification<T extends string> = OneOrMore<T | [T, IndexDirection] | Partial<Record<T, IndexDirection>>>;
