/* eslint-disable no-restricted-imports */
import type { ObjectId } from 'mongodb';

export type ProjectionKeys<T> = {
  [K in keyof T as K extends '_id' ? never : K]?: 1;
};

export type ProjectedType<T, P extends ProjectionKeys<T>> = {
  [K in keyof T & keyof P as P[K] extends 1 ? K : never]: T[K];
} & ('_id' extends keyof T ? { _id: T['_id'] } : { _id: ObjectId });

export const parseProjection = <T extends object>(str: string) => {
  const projection = JSON.parse(str) as Partial<Record<keyof T, number>>;
  if (typeof projection !== 'object') throw new Error('Invalid projection');
  return projection as Record<keyof T, number>;
};
