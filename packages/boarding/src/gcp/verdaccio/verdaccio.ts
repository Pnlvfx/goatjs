/* eslint-disable no-console */
import fs from 'node:fs/promises';
import { packageSchema } from './parser.js';
import { download } from '@goatjs/download';
import { execAsync } from '@goatjs/node/exec';
import path from 'node:path';

// eslint-disable-next-line sonarjs/no-clear-text-protocols
const VERDACCIO_URL = 'http://192.168.1.100:4873';

export interface VerdaccioDepsParams {
  /** Where to store the generated tarball. */
  outputDir: string;
  /** The name of the packages to install */
  packages: string[];
}

export const resolveVerdaccioDependencies = async ({ packages, outputDir }: VerdaccioDepsParams) => {
  try {
    await fs.mkdir(outputDir);
  } catch {}
  let installCommand = 'yarn add';
  for (const pkg of packages) {
    console.log(`\n--- Processing ${pkg} ---`);
    const tarball = await getPkgTarball(`${VERDACCIO_URL}/${pkg}`);
    const output = await download(tarball, { directory: outputDir });
    const definitelyPosix = output.replaceAll(path.sep, path.posix.sep);
    installCommand += ` ${pkg}@file:${definitelyPosix}`;
  }

  await execAsync(installCommand);
};

const getPkgTarball = async (url: string) => {
  const res = await fetch(url);
  const data = await packageSchema.parseAsync(await res.json());
  const latest = data['dist-tags'].latest;
  const tarball = data.versions[latest]?.dist.tarball;
  if (!tarball) throw new Error(`Tarball not found for package ${data.name}`);
  return tarball;
};
