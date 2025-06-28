import fs from 'node:fs/promises';
import path from 'node:path';
import { pathExist } from '../src/fs.js';

const compiledPath = path.join('src', 'compiled');

if (!(await pathExist(compiledPath))) {
  await fs.mkdir(compiledPath, { recursive: true });
}
const rootPrettier = path.join('..', '..', '.prettierrc');
const prettierCompiled = path.join(compiledPath, 'prettier-configs.json');
await fs.cp(rootPrettier, prettierCompiled);
