type CamelToKebabCaseInner<S extends string> = S extends `${infer First}${infer Rest}`
  ? First extends Uppercase<First>
    ? `-${Lowercase<First>}${CamelToKebabCaseInner<Rest>}`
    : `${First}${CamelToKebabCaseInner<Rest>}`
  : S;

export type CamelToKebabCase<S extends string> = S extends `${infer First}${infer Rest}` ? `${Lowercase<First>}${CamelToKebabCaseInner<Rest>}` : S;

export type Kebabize<T> = T extends (infer U)[]
  ? Kebabize<U>[]
  : T extends object
    ? {
        [K in keyof T as K extends string ? CamelToKebabCase<K> : K]: Kebabize<T[K]>;
      }
    : T;

export const toKebabCase = <T extends string>(str: T) => {
  return str.replaceAll(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() as CamelToKebabCase<T>;
};

export const kebabizeObject = <T extends object>(obj: T) => {
  const response: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const kebabKey = toKebabCase(key);
    response[kebabKey] = typeof value === 'object' && value !== null ? kebabizeObject(value) : value;
  }
  return response as Kebabize<T>;
};
