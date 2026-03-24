/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
export const toUpperCase = <T extends string>(string: T) => {
  return string.toUpperCase() as Uppercase<T>;
};
