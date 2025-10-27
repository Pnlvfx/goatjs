import prettierConfigs from './compiled/prettier-configs.json' with { type: 'json' };
import nativePrettier from 'prettier';

export const prettierParsers = ['json', 'typescript', 'babel'] as const;
export type PrettierParser = (typeof prettierParsers)[number];

interface Options {
  readonly parser: PrettierParser;
}

export const prettier = {
  format: (source: string, options: Options) => {
    /** @ts-expect-error it's good but json import doesn't keep literals. */
    return nativePrettier.format(source, { ...prettierConfigs, ...options });
  },
};
