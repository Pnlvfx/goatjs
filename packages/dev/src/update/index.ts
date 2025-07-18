/* eslint-disable no-console */

import { execAsync } from '@goatjs/node/exec';

interface Options {
  readonly debug?: boolean;
}

export const updateGitDeps = async (packages: Record<string, string>, { debug }: Options = {}) => {
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
