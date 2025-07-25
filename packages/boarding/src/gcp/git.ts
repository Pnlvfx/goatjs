/* eslint-disable no-console */
import fs from 'node:fs/promises';
import path from 'node:path';
import { execAsync } from '@goatjs/node/exec';
import { git } from '@goatjs/node/git/git';

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
    await fs.access(packageDir);
    const status = await git.status({ porcelain: true, cwd: packageDir });
    if (status) throw new Error('Please stash or commit package changes before proceeding');
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
