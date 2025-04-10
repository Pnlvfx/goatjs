export type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
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
  return str.replaceAll(/[_-](\w)/g, (_, letter: string) => letter.toUpperCase()) as SnakeToCamelCase<T>;
};

export const camelizeObject = <T extends object>(obj: T) => {
  const response: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'object') {
      response[key] = camelizeObject(value);
    } else {
      response[snakeToCamel(key)] = value;
    }
  }

  return response as Camelize<T>;
};
