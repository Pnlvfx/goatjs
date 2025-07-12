// TODO split by files

export const regex = {
  /** Detect if a given string has emoji. */
  detectEmoji: /<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu,
  /** Remove any emoji from a given string. */
  removeEmojis: (str: string) => str.replaceAll(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, ''),
  /** Remove parentheses and the content inside it from a given string.
   * @credit https://github.com/joshunrau/ytdl-mp3/blob/main/src/utils.ts
   */
  removeParenthesizedText: (s: string) => {
    // eslint-disable-next-line sonarjs/slow-regex
    const regex = /\s*([([][^()[\]]*[)\]])\s*/g;
    while (regex.test(s)) {
      s = s.replaceAll(regex, '');
    }
    return s;
  },
  /** Remove any accents and tranform it to it's relative character from a given string. Example: "Nèza" will return "Neza" */
  normalizeAccents: (str: string) => str.normalize('NFD').replaceAll(/\p{Diacritic}/gu, ''),
  /** Match a string even with some differences, but note that it might be incorrect. */
  simpleMatch: (name: string) => {
    const regexString = name
      // eslint-disable-next-line unicorn/prefer-spread
      .split('')
      .map((char) => `${char}.*?`)
      .join('.*?');
    return new RegExp(`^.*?${regexString}.*?$`, 'i');
  },
};
