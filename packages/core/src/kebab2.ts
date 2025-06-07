/* eslint-disable unicorn/prefer-string-replace-all */

import type { CaseOptions, Locale } from './string/types.js';

// Regexps involved with splitting words in various case formats.
const SPLIT_LOWER_UPPER_RE = /([\p{Ll}\d])(\p{Lu})/gu;
// eslint-disable-next-line sonarjs/single-char-in-character-classes
const SPLIT_UPPER_UPPER_RE = /(\p{Lu})([\p{Lu}][\p{Ll}])/gu;

// Used to iterate over the initial split result and separate numbers.
const SPLIT_SEPARATE_NUMBER_RE = /(\d)\p{Ll}|(\p{L})\d/u;

// Regexp involved with stripping non-word characters from the result.
const DEFAULT_STRIP_REGEXP = /[^\p{L}\d]+/giu;

// The replacement value for splits.
const SPLIT_REPLACE_VALUE = '$1\0$2';

// The default characters to keep after transforming case.
const DEFAULT_PREFIX_SUFFIX_CHARACTERS = '';

/**
 * Options used for converting strings to pascal/camel case.
 */
export interface PascalCaseOptions extends CaseOptions {
  mergeAmbiguousCharacters?: boolean;
}

/**
 * Split any cased input strings into an array of words.
 */
export function split(value: string) {
  let result = value.trim();

  result = result.replace(SPLIT_LOWER_UPPER_RE, SPLIT_REPLACE_VALUE).replace(SPLIT_UPPER_UPPER_RE, SPLIT_REPLACE_VALUE);

  result = result.replace(DEFAULT_STRIP_REGEXP, '\0');

  let start = 0;
  let end = result.length;

  // Trim the delimiter from around the output string.
  while (result.charAt(start) === '\0') start++;
  if (start === end) return [];
  while (result.charAt(end - 1) === '\0') end--;

  return result.slice(start, end).split(/\0/g);
}

/**
 * Split the input string into an array of words, separating numbers.
 */
export function splitSeparateNumbers(value: string) {
  const words = split(value);
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const match = word ? SPLIT_SEPARATE_NUMBER_RE.exec(word) : undefined;
    if (word && match) {
      const offset = match.index + (match[1] ?? match[2] ?? '').length;
      words.splice(i, 1, word.slice(0, offset), word.slice(offset));
    }
  }
  return words;
}

/**
 * Convert a string to space separated lower case (`foo bar`).
 */
export function noCase(input: string, options?: CaseOptions) {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  return prefix + words.map(lowerFactory(options?.locale)).join(options?.delimiter ?? ' ') + suffix;
}

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

/**
 * Convert a string to capital case (`Foo Bar`).
 */
export function capitalCase(input: string, options?: CaseOptions) {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  const lower = lowerFactory(options?.locale);
  const upper = upperFactory(options?.locale);
  return prefix + words.map(capitalCaseTransformFactory(lower, upper)).join(options?.delimiter ?? ' ') + suffix;
}

/**
 * Convert a string to constant case (`FOO_BAR`).
 */
export function constantCase(input: string, options?: CaseOptions) {
  const [prefix, words, suffix] = splitPrefixSuffix(input, options);
  return prefix + words.map(upperFactory(options?.locale)).join(options?.delimiter ?? '_') + suffix;
}

/**
 * Convert a string to dot case (`foo.bar`).
 */
export function dotCase(input: string, options?: CaseOptions) {
  return noCase(input, { delimiter: '.', ...options });
}

/**
 * Convert a string to path case (`foo/bar`).
 */
export function pathCase(input: string, options?: CaseOptions) {
  return noCase(input, { delimiter: '/', ...options });
}

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

/**
 * Convert a string to snake case (`foo_bar`).
 */
export function snakeCase(input: string, options?: CaseOptions) {
  return noCase(input, { delimiter: '_', ...options });
}

/**
 * Convert a string to header case (`Foo-Bar`).
 */
export function trainCase(input: string, options?: CaseOptions) {
  return capitalCase(input, { delimiter: '-', ...options });
}

function lowerFactory(locale: Locale): (input: string) => string {
  return locale === false ? (input: string) => input.toLowerCase() : (input: string) => input.toLocaleLowerCase(locale);
}

function upperFactory(locale: Locale): (input: string) => string {
  return locale === false ? (input: string) => input.toUpperCase() : (input: string) => input.toLocaleUpperCase(locale);
}

function capitalCaseTransformFactory(lower: (input: string) => string, upper: (input: string) => string) {
  return (word: string) => {
    const first = word.at(0);
    return first ? `${upper(first)}${lower(word.slice(1))}` : word;
  };
}

function pascalCaseTransformFactory(lower: (input: string) => string, upper: (input: string) => string) {
  return (word: string, index: number) => {
    const char0 = word[0] ?? '';
    const initial = index > 0 && char0 >= '0' && char0 <= '9' ? '_' + char0 : upper(char0);
    return initial + lower(word.slice(1));
  };
}

function splitPrefixSuffix(input: string, options: CaseOptions = {}): [string, string[], string] {
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
