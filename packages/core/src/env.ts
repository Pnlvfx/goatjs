export const getSanitizedConfig = <T extends object>(config: Partial<T>) => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) throw new Error(`Missing key ${key}`);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  return config as T;
};
