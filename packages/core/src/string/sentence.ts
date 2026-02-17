import { capitalCaseTransformFactory, lowerFactory, splitPrefixSuffix, upperFactory } from './internal.ts';
import type { CaseOptions } from './options.ts';

/**
 * Convert a string to path case (`Foo bar`).
 */
export function sentenceCase(input: string, options?: CaseOptions) {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  const lower = lowerFactory(options?.locale);
  const upper = upperFactory(options?.locale);
  const transform = capitalCaseTransformFactory(lower, upper);
  return (
    prefix +
    words
      .map((word, index) => {
        if (index === 0) return transform(word);
        return lower(word);
      })
      .join(options?.delimiter ?? ' ') +
    suffix
  );
}
