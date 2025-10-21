type AllowedValue = string | boolean | undefined;

type BashOptions = Record<string, AllowedValue>;

export const parseBashOptions = (options: BashOptions) => {
  const values = [];
  for (const [key, value] of Object.entries(options)) {
    if (value === undefined) continue;
    switch (typeof value) {
      case 'boolean': {
        if (value) {
          values.push(`--${key}`);
        }
        break;
      }
      case 'string': {
        values.push(`--${key} ${value}`);
        break;
      }
      default: {
        throw new Error(`Invalid bash option value received at ${key}.`);
      }
    }
  }

  return values.join(' ');
};
