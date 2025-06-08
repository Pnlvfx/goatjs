export const toLowerCase = <T extends string>(str: T) => {
  return str.toLowerCase() as Lowercase<T>;
};
