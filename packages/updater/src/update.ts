/* eslint-disable no-console */
// try to move into his own package so we can use it here too.

import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

export const updateLocalDeps = async (packages: Record<string, string>) => {
  const deps = Object.entries(packages).map(([name, version]) => `${name}@${version}`);
  const { stderr, stdout } = await execAsync(`yarn up ${deps.join(' ')}`);
  console.log(stderr);
  console.log(stdout);
};
