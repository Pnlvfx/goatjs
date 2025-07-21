/* eslint-disable no-console */
import { pathExist } from '@goatjs/node/fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { checkGitStatus } from '../verdaccio/helpers.js';
import { execAsync } from '@goatjs/node/exec';
import { git } from '../git/git.js';

export interface PrivateGitParams {
  /** Where to store the generated tarball. */
  outputDir: string;
  /** The path on your system where all this packages are located */
  packagesDir: string;
  /** The name of the packages to download */
  packages: string[];
}

/** Used to resolve your private git dependencies into tarball
 * and allow gcp to safely run install. (It doesn't work with monorepo as of now)
 * We keept it for reference but we suggest you to use the new and easy verdaccio way.
 */
export const resolvePrivateGitDependencies = async ({ packages, outputDir, packagesDir }: PrivateGitParams) => {
  try {
    await fs.mkdir(outputDir);
  } catch {}
  for (const pkg of packages) {
    console.log(`\n--- Processing ${pkg} ---`);
    const packageDir = path.join(packagesDir, pkg);
    if (!(await pathExist(packageDir))) throw new Error(`✗ Package not found on your system: ${packageDir}`);
    await checkGitStatus({ cwd: packageDir });
    await git.pull({ cwd: packageDir });
    await execAsync('yarn', { cwd: packageDir });
    const filename = `${pkg}.tgz`;
    await execAsync(`yarn pack --filename ${filename}`, { cwd: packageDir });
    const outputFile = path.join(outputDir, filename);
    await fs.rename(path.join(packageDir, filename), outputFile);
    // do not use path.join here as on windows it will use windows syntax and it doesn't work on gcloud
    await execAsync(`yarn add ${pkg}@file:${outputDir}/${filename}`);
    console.log(`Package ${pkg} installed`);
  }
};
