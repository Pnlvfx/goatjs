import type { CaseOptions } from './options.js';
import { noCase } from './internal.js';

type IsNumericString<S extends string> = S extends `${number}` ? true : false;

type KebabCaseInner<S extends string> = S extends `${infer First}${infer Rest}`
  ? First extends Uppercase<First>
    ? `-${Lowercase<First>}${KebabCaseInner<Rest>}`
    : `${First}${KebabCaseInner<Rest>}`
  : S;

export type KebabCase<S extends string> =
  IsNumericString<S> extends true ? S : S extends `${infer First}${infer Rest}` ? `${Lowercase<First>}${KebabCaseInner<Rest>}` : S;

/**
 * Convert a string to kebab case (`foo-bar`).
 */
export function kebabCase(input: string, options?: CaseOptions) {
  return noCase(input, { delimiter: '-', ...options });
}
