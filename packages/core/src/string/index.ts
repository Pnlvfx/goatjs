export const indexOf = (source: string, searchString: string, position?: number) => {
  // eslint-disable-next-line sonarjs/argument-type
  const value = source.indexOf(searchString, position);
  if (value === -1) throw new Error(`"${searchString}" not found on "${source}"`);
  return value;
};

export const lastIndexOf = (source: string, searchString: string, position?: number) => {
  // eslint-disable-next-line sonarjs/argument-type
  const value = source.lastIndexOf(searchString, position);
  if (value === -1) throw new Error(`"${searchString}" not found on "${source}"`);
  return value;
};
