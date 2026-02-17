import fs from 'node:fs/promises';
import path from 'node:path';
import { fsExtra } from './fs-extra/index.ts';
import { mark } from './mark.ts';
interface Params {
  inputFolder: string;
  outputFolder: string;
  files: string[] | readonly string[] | '*';
}

const withComment = new Set(['js', 'ts', 'tsx', 'jsx', 'cjs', 'mjs', 'cts']);

// wrapper to support params as array
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

  for (const item of array) {
    const fullItemPath = path.join(inputFolder, item);
    const stats = await fs.stat(fullItemPath);
    if (stats.isDirectory()) {
      const $outputFolder = path.join(outputFolder, item);
      await $copyFilesFromFolder({ inputFolder: fullItemPath, outputFolder: $outputFolder, files: '*' });
    } else {
      const buf = await fs.readFile(fullItemPath);
      const extname = path.extname(item).slice(1);
      const isJs = withComment.has(extname);
      const content = isJs ? `${mark()}\n\n${buf.toString()}` : buf.toString();
      await fs.writeFile(path.join(outputFolder, item), content);
    }
  }
};
