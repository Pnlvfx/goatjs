import path from 'node:path';
import os from 'node:os';
import { getProjectName } from './helpers.js';

const { scope, name } = await getProjectName();
export const cwd = path.join(os.homedir(), '.coraline', scope ?? name, ...(scope ? [name] : []));
