import type { IndexDirection, OneOrMore } from 'mongodb';

export type IndexSpecification<T extends string> = OneOrMore<T | [T, IndexDirection] | Record<T, IndexDirection> | Map<T, IndexDirection>>;
