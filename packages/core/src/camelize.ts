type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S extends `${infer T}-${infer U}`
    ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
    : S;

export type Camelize<T> = T extends (infer U)[]
  ? Camelize<U>[]
  : T extends object
    ? {
        [K in keyof T as K extends string ? SnakeToCamelCase<K> : K]: Camelize<T[K]>;
      }
    : T;

export const snakeToCamel = <T extends string>(str: T) => {
  if (!/[_-]/.test(str)) return str as SnakeToCamelCase<T>;
  return str.toLowerCase().replaceAll(/([_-][a-z])/g, (group) => group.toUpperCase()) as SnakeToCamelCase<T>;
};
