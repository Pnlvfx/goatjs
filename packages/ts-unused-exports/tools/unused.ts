import { prettier } from '@goatjs/node/prettier';
import { findUnusedExports } from '../src/ts-unused-exports.ts';

const unused = await findUnusedExports({ ignoreFiles: ['eslint.config.js'] });

if (unused) {
  throw new Error(
    `The following exports are unused, add them on the ignore or remove the exports to continue.\n${await prettier.format(JSON.stringify(unused), { parser: 'json' })}`,
  );
}
