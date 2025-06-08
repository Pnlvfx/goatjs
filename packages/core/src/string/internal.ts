import { split, splitSeparateNumbers } from './split.js';
import type { CaseOptions, Locale } from './options.js';

// The default characters to keep after transforming case.
const DEFAULT_PREFIX_SUFFIX_CHARACTERS = '';

/**
 * Convert a string to space separated lower case (`foo bar`).
 */
export function noCase(input: string, options?: CaseOptions) {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  return prefix + words.map(lowerFactory(options?.locale)).join(options?.delimiter ?? ' ') + suffix;
}

export function splitPrefixSuffix(input: string, options: CaseOptions = {}): [string, string[], string] {
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  const splitFn = options.split ?? (options.separateNumbers ? splitSeparateNumbers : split);
  const prefixCharacters = options.prefixCharacters ?? DEFAULT_PREFIX_SUFFIX_CHARACTERS;
  const suffixCharacters = options.suffixCharacters ?? DEFAULT_PREFIX_SUFFIX_CHARACTERS;
  let prefixIndex = 0;
  let suffixIndex = input.length;

  while (prefixIndex < input.length) {
    const char = input.charAt(prefixIndex);
    if (!prefixCharacters.includes(char)) break;
    prefixIndex++;
  }

  while (suffixIndex > prefixIndex) {
    const index = suffixIndex - 1;
    const char = input.charAt(index);
    if (!suffixCharacters.includes(char)) break;
    suffixIndex = index;
  }

  return [input.slice(0, prefixIndex), splitFn(input.slice(prefixIndex, suffixIndex)), input.slice(suffixIndex)];
}

export function lowerFactory(locale: Locale): (input: string) => string {
  return locale === false ? (input: string) => input.toLowerCase() : (input: string) => input.toLocaleLowerCase(locale);
}

export function upperFactory(locale: Locale): (input: string) => string {
  return locale === false ? (input: string) => input.toUpperCase() : (input: string) => input.toLocaleUpperCase(locale);
}

export function capitalCaseTransformFactory(lower: (input: string) => string, upper: (input: string) => string) {
  return (word: string) => {
    const first = word.at(0);
    return first ? `${upper(first)}${lower(word.slice(1))}` : word;
  };
}

export function pascalCaseTransformFactory(lower: (input: string) => string, upper: (input: string) => string) {
  return (word: string, index: number) => {
    const char0 = word[0] ?? '';
    const initial = index > 0 && char0 >= '0' && char0 <= '9' ? '_' + char0 : upper(char0);
    return initial + lower(word.slice(1));
  };
}
