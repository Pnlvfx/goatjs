import type { PascalCaseOptions } from './options.js';
import { capitalCaseTransformFactory, lowerFactory, pascalCaseTransformFactory, splitPrefixSuffix, upperFactory } from './internal.js';

export type CamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<CamelCase<U>>}`
  : S extends `${infer T}-${infer U}`
    ? `${T}${Capitalize<CamelCase<U>>}`
    : S;

/**
 * Convert a string to camel case (`fooBar`).
 */
export function camelCase(input: string, options?: PascalCaseOptions) {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  const lower = lowerFactory(options?.locale);
  const upper = upperFactory(options?.locale);
  const transform = options?.mergeAmbiguousCharacters ? capitalCaseTransformFactory(lower, upper) : pascalCaseTransformFactory(lower, upper);
  return (
    prefix +
    words
      .map((word, index) => {
        if (index === 0) return lower(word);
        return transform(word, index);
      })
      .join(options?.delimiter ?? '') +
    suffix
  );
}
