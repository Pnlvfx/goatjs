import path from 'node:path';
import os from 'node:os';
import { getProjectName, mkDir } from './helpers.js';

const { scope, name } = await getProjectName();
const root = path.join(os.homedir(), '.coraline');
export const coralineRoot = path.join(root, 'all');
export const cwd = path.join(root, scope ?? name, ...(scope ? [name] : []));

await mkDir(root);
await mkDir(coralineRoot);
await mkDir(cwd, true);
