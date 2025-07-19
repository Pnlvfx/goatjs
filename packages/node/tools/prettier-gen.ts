import fs from 'node:fs/promises';
import path from 'node:path';

const compiledPath = path.join('src', 'compiled');

try {
  await fs.mkdir(compiledPath, { recursive: true });
} catch {}
const rootPrettier = path.join('..', '..', '.prettierrc');
const prettierCompiled = path.join(compiledPath, 'prettier-configs.json');
await fs.cp(rootPrettier, prettierCompiled);
