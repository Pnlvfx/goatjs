import path from 'node:path';
import os from 'node:os';
import { getProjectName } from './helpers.js';

export const cwd = path.join(os.homedir(), '.coraline', await getProjectName());
