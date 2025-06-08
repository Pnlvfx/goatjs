import { kebabCase, type KebabCase } from '../string/kebab.js';
import type { CaseOptions } from '../string/options.js';

export type Kebabize<T> = T extends (infer U)[]
  ? Kebabize<U>[]
  : T extends object
    ? {
        [K in keyof T as K extends string ? KebabCase<K> : K]: Kebabize<T[K]>;
      }
    : T;

export const kebabizeObject = <T extends object>(obj: T, options?: CaseOptions) => {
  const response: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const kebabKey = kebabCase(key, options);
    response[kebabKey] = typeof value === 'object' && value !== null ? kebabizeObject(value, options) : value;
  }
  return response as Kebabize<T>;
};
