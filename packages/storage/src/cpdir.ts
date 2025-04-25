import fs from 'node:fs/promises';
import path from 'node:path';

export const cpdir = async (sourceDir: string, targetDir: string) => {
  // Create the target directory if it doesn't exist
  await fs.mkdir(targetDir, { recursive: true });

  const files = await fs.readdir(sourceDir);

  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    const stat = await fs.stat(sourcePath);

    await (stat.isDirectory() ? cpdir(sourcePath, targetPath) : fs.cp(sourcePath, targetPath));
  }
};
