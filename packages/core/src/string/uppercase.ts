export const toUpperCase = <T extends string>(string: T) => {
  return string.toUpperCase() as Uppercase<T>;
};
