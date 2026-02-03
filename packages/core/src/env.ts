export const getSanitizedConfig = <T extends object>(config: Partial<T>) => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) throw new Error(`Missing key ${key}`);
  }
  return config as T;
};
