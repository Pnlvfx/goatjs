import fs from 'node:fs/promises';
import path from 'node:path';

interface Params {
  inputFolder: string;
  outputFolder: string;
  files: string[];
}

export const copyFilesFromFolder = async ({ files, inputFolder, outputFolder }: Params) => {
  try {
    await fs.access(outputFolder);
  } catch {
    await fs.mkdir(outputFolder);
  }

  for (const file of files) {
    const buf = await fs.readFile(path.join(inputFolder, file));
    await fs.writeFile(path.join(outputFolder, file), buf);
  }
};
