/**
 * Supported locale values. Use `false` to ignore locale.
 * Defaults to `undefined`, which uses the host environment.
 */
export type Locale = string[] | string | false | undefined;

/**
 * Options used for converting strings to any case.
 */
export interface CaseOptions {
  locale?: Locale;
  split?: (value: string) => string[];
  /** @deprecated Pass `split: splitSeparateNumbers` instead. */
  separateNumbers?: boolean;
  delimiter?: string;
  prefixCharacters?: string;
  suffixCharacters?: string;
}

/**
 * Options used for converting strings to pascal/camel case.
 */
export interface PascalCaseOptions extends CaseOptions {
  mergeAmbiguousCharacters?: boolean;
}
