/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
export const toLowerCase = <T extends string>(str: T) => {
  return str.toLowerCase() as Lowercase<T>;
};
