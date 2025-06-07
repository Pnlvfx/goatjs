// https://github.com/joakimbeng/kebab-case

type IsNumericString<S extends string> = S extends `${number}` ? true : false;

type CamelToKebabCaseInner<S extends string> = S extends `${infer First}${infer Rest}`
  ? First extends Uppercase<First>
    ? `-${Lowercase<First>}${CamelToKebabCaseInner<Rest>}`
    : `${First}${CamelToKebabCaseInner<Rest>}`
  : S;

export type CamelToKebabCase<S extends string> =
  IsNumericString<S> extends true ? S : S extends `${infer First}${infer Rest}` ? `${Lowercase<First>}${CamelToKebabCaseInner<Rest>}` : S;

export type Kebabize<T> = T extends (infer U)[]
  ? Kebabize<U>[]
  : T extends object
    ? {
        [K in keyof T as K extends string ? CamelToKebabCase<K> : K]: Kebabize<T[K]>;
      }
    : T;

const KEBAB_REGEX = /\p{Lu}/gu;

/**
 * Transforms a string into kebab-case.
 *
 * @example
 * kebabCase("helloWorld"); // "hello-world"
 * kebabCase("HelloWorld"); // "-hello-world"
 * kebabCase("HelloWorld", {leadingDash: false}); // "hello-world"
 *
 */
export const kebabCase = <T extends string>(string: T, { leadingDash = false } = {}) => {
  const result = string.replaceAll(KEBAB_REGEX, (match) => `-${match.toLowerCase()}`);
  // eslint-disable-next-line unicorn/no-nested-ternary, sonarjs/no-nested-conditional
  return (leadingDash ? result : result.startsWith('-') ? result.slice(1) : result) as CamelToKebabCase<T>;
};

export const kebabizeObject = <T extends object>(obj: T) => {
  const response: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const kebabKey = kebabCase(key);
    response[kebabKey] = typeof value === 'object' && value !== null ? kebabizeObject(value) : value;
  }
  return response as Kebabize<T>;
};
