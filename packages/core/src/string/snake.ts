import type { CaseOptions } from './options.js';
import { noCase } from './internal.js';

export type SnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${SnakeCase<U>}`
  : S;

/**
 * Convert a string to snake case (`foo_bar`).
 */
export function snakeCase(input: string, options?: CaseOptions) {
  return noCase(input, { delimiter: '_', ...options });
}
