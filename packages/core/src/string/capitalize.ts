import { capitalCaseTransformFactory, lowerFactory, splitPrefixSuffix, upperFactory } from './internal.ts';
import type { CaseOptions } from './options.ts';

/**
 * Convert a string to capital case (`Foo Bar`).
 */
export function capitalCase(input: string, options?: CaseOptions) {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  const lower = lowerFactory(options?.locale);
  const upper = upperFactory(options?.locale);
  return prefix + words.map(capitalCaseTransformFactory(lower, upper)).join(options?.delimiter ?? ' ') + suffix;
}
