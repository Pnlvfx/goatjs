/* eslint-disable no-console */
// TODO try to move into his own package so we can use it here too.

import { exec } from 'node:child_process';
import { promisify } from 'node:util';

interface Options {
  readonly debug?: boolean;
}

const execAsync = promisify(exec);

export const updateLocalDeps = async (packages: Record<string, string>, { debug }: Options = {}) => {
  const deps = Object.entries(packages).map(([name, version]) => `${name}@${version}`);
  const command = `yarn up ${deps.join(' ')}`;
  if (debug) {
    console.log(`running ${command}`);
  }
  const { stderr, stdout } = await execAsync(command);
  if (stderr) {
    console.log(stderr);
  }
  if (stdout) {
    console.log(stdout);
  }
};
