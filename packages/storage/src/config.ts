import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';
import { getProjectName } from './helpers.js';

const { scope, name } = await getProjectName();
const baseRoot = path.join(os.homedir(), '.coraline');
export const root = path.join(baseRoot, 'all');
export const cwd = path.join(baseRoot, scope ?? '', name);

export const initializeStorage = async () => {
  try {
    await fs.mkdir(baseRoot);
  } catch {}

  try {
    await fs.mkdir(root);
  } catch {}

  await fs.mkdir(cwd, { recursive: true });
};
