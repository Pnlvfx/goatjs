import type { CaseOptions, PascalCaseOptions } from './options.ts';
import { capitalCase } from './capitalize.ts';
import { capitalCaseTransformFactory, lowerFactory, pascalCaseTransformFactory, splitPrefixSuffix, upperFactory } from './internal.ts';

/**
 * Convert a string to pascal case (`FooBar`).
 */
export function pascalCase(input: string, options?: PascalCaseOptions) {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  const lower = lowerFactory(options?.locale);
  const upper = upperFactory(options?.locale);
  const transform = options?.mergeAmbiguousCharacters ? capitalCaseTransformFactory(lower, upper) : pascalCaseTransformFactory(lower, upper);
  return prefix + words.map((word, i) => transform(word, i)).join(options?.delimiter ?? '') + suffix;
}

/**
 * Convert a string to pascal snake case (`Foo_Bar`).
 */
export function pascalSnakeCase(input: string, options?: CaseOptions) {
  return capitalCase(input, { delimiter: '_', ...options });
}
