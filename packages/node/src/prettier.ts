import prettierConfigs from './compiled/prettier-configs.json' with { type: 'json' };
import nativePrettier from 'prettier';

interface Options {
  readonly parser: 'json' | 'typescript' | 'babel';
}

export const prettier = {
  format: (source: string, options: Options) => {
    /** @ts-expect-error it's good but we of course json import doesn't keep literals. */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return nativePrettier.format(source, { ...prettierConfigs, ...options });
  },
};
