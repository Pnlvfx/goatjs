/* eslint-disable unicorn/prefer-string-replace-all */
// Regexps involved with splitting words in various case formats.
const SPLIT_LOWER_UPPER_RE = /([\p{Ll}\d])(\p{Lu})/gu;
// eslint-disable-next-line sonarjs/single-char-in-character-classes
const SPLIT_UPPER_UPPER_RE = /(\p{Lu})([\p{Lu}][\p{Ll}])/gu;

// Regexp involved with stripping non-word characters from the result.
const DEFAULT_STRIP_REGEXP = /[^\p{L}\d]+/giu;

// Used to iterate over the initial split result and separate numbers.
const SPLIT_SEPARATE_NUMBER_RE = /(\d)\p{Ll}|(\p{L})\d/u;

// The replacement value for splits.
const SPLIT_REPLACE_VALUE = '$1\0$2';

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
