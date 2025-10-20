import fs from 'node:fs/promises';
import path from 'node:path';
import { fsExtra } from './fs-extra/index.js';
import { mark } from './mark.js';
interface Params {
  inputFolder: string;
  outputFolder: string;
  files: string[] | readonly string[] | '*';
}

const withComment = new Set(['js', 'ts', 'tsx', 'jsx', 'cjs', 'mjs', 'cts']);

export const copyFilesFromFolder = async (params: Params | Params[]) => {
  const array = Array.isArray(params) ? params : [params];

  for (const item of array) {
    await $copyFilesFromFolder(item);
  }
};

const $copyFilesFromFolder = async ({ files, inputFolder, outputFolder }: Params) => {
  try {
    await fs.mkdir(outputFolder, { recursive: true });
  } catch {}

  const array = files === '*' ? await fsExtra.readdir(inputFolder) : files;

  for (const file of array) {
    const buf = await fs.readFile(path.join(inputFolder, file));
    const extname = path.extname(file).slice(1);
    const isJs = withComment.has(extname);
    const content = isJs ? `${mark()}\n\n${buf.toString()}` : buf.toString();
    await fs.writeFile(path.join(outputFolder, file), content);
  }
};
