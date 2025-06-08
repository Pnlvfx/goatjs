import type { CaseOptions } from '../string/options.js';
import { snakeCase, type SnakeCase } from '../string/snake.js';

export type Snakeize<T> = T extends (infer U)[]
  ? Snakeize<U>[]
  : T extends object
    ? {
        [K in keyof T as K extends string ? SnakeCase<K> : K]: Snakeize<T[K]>;
      }
    : T;

export const snakelizeObject = <T extends object>(obj: T, options?: CaseOptions) => {
  const response: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object') {
      response[key] = snakelizeObject(value, options);
    } else {
      response[snakeCase(key, options)] = value;
    }
  }

  return response as Snakeize<T>;
};
