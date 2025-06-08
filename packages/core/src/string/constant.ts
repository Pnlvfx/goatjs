import { splitPrefixSuffix, upperFactory } from './internal.js';
import type { CaseOptions } from './options.js';

/**
 * Convert a string to constant case (`FOO_BAR`).
 */
export function constantCase(input: string, options?: CaseOptions) {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  return prefix + words.map(upperFactory(options?.locale)).join(options?.delimiter ?? '_') + suffix;
}
