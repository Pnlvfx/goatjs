import { convertFromDirectory, type Settings } from 'joi-to-typescript';
import fs from 'node:fs/promises';
import path from 'node:path';
import prettier from 'prettier';

const patchImports = async (dir: string) => {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = await fs.stat(fullPath);
    if (stat.isDirectory()) {
      await patchImports(fullPath);
    } else {
      const buf = await fs.readFile(fullPath);
      const updatedContent = buf
        .toString()
        .replaceAll(/\bimport\s+(?!type\b)/g, 'import type ')
        .replaceAll(/(from\s+["'])([^"']+)(["'])/g, (match, p1, p2, p3) => {
          if (typeof p1 === 'string' && typeof p2 === 'string' && typeof p3 === 'string' && !p2.endsWith('.js')) {
            return p2 === '.' ? `${p1}${p2}/index.js${p3}` : `${p1}${p2}.js${p3}`;
          }
          return match;
        });
      const prettierConfig = await prettier.resolveConfig(fullPath);
      await fs.writeFile(fullPath, await prettier.format(updatedContent, { ...prettierConfig, parser: 'typescript' }));
    }
  }
};

type TypeSettings = Partial<Omit<Settings, 'typeOutputDirectory'>> & {
  typeOutputDirectory: string;
};

export const generateTypes = async (params: TypeSettings) => {
  await convertFromDirectory(params);
  await patchImports(params.typeOutputDirectory);
};
