import type { CaseOptions } from './options.ts';
import { noCase } from './internal.ts';

export type SnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${SnakeCase<U>}`
  : S;

/**
 * Convert a string to snake case (`foo_bar`).
 */
export const snakeCase = <T extends string>(input: T, options?: CaseOptions) => {
  return noCase(input, { delimiter: '_', ...options }) as SnakeCase<T>;
};
