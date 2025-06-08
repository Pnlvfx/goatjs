import { camelCase, type CamelCase } from '../string/camel.js';

export type Camelize<T> = T extends (infer U)[]
  ? Camelize<U>[]
  : T extends object
    ? {
        [K in keyof T as K extends string ? CamelCase<K> : K]: Camelize<T[K]>;
      }
    : T;

export const camelizeObject = <T extends object>(obj: T) => {
  const response: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object') {
      response[key] = camelizeObject(value);
    } else {
      response[camelCase(key)] = value;
    }
  }

  return response as Camelize<T>;
};
