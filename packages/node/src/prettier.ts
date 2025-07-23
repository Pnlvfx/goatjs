import prettierConfigs from './compiled/prettier-configs.json' with { type: 'json' };
import nativePrettier from 'prettier';

export type PrettierParsingOption = 'json' | 'typescript' | 'babel';

interface Options {
  readonly parser: PrettierParsingOption;
}

export const prettier = {
  format: (source: string, options: Options) => {
    /** @ts-expect-error it's good but json import doesn't keep literals. */
    return nativePrettier.format(source, { ...prettierConfigs, ...options });
  },
};
