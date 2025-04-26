export type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${CamelToSnakeCase<U>}`
  : S;

export type Snakeize<T> = T extends (infer U)[]
  ? Snakeize<U>[]
  : T extends object
    ? {
        [K in keyof T as K extends string ? CamelToSnakeCase<K> : K]: Snakeize<T[K]>;
      }
    : T;

export const camelToSnake = <T extends string>(str: T) => {
  if (!/[A-Z]/.test(str)) return str as CamelToSnakeCase<T>;
  return str.replaceAll(/([A-Z])/g, (letter: string) => `_${letter.toLowerCase()}`) as CamelToSnakeCase<T>;
};
