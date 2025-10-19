import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';
import { getProjectName } from './helpers.js';

const { scope, name } = await getProjectName();
const root = path.join(os.homedir(), '.coraline');
export const coralineRoot = path.join(root, 'all');
export const cwd = path.join(root, scope ?? name, ...(scope ? [name] : []));

try {
  await fs.mkdir(root);
} catch {}

try {
  await fs.mkdir(coralineRoot);
} catch {}

await fs.mkdir(cwd, { recursive: true });
