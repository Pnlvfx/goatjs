import { getRootPkgJSON } from '@goatjs/node/package-json';
import { glob } from 'node:fs/promises';
import path from 'node:path';

export const getExportedFiles = async () => {
  const pkgJson = await getRootPkgJSON();
  const exports = pkgJson.exports;
  const exportedFiles = new Set<string>();

  if (!exports) return exportedFiles;

  const processValue = async (value: unknown): Promise<void> => {
    if (typeof value === 'string') {
      if (value.includes('*')) {
        const matches = glob(path.resolve(value));
        for await (const match of matches) {
          exportedFiles.add(match);
        }
      } else {
        exportedFiles.add(path.resolve(value));
      }
    } else if (typeof value === 'object' && value !== null) {
      for (const val of Object.values(value)) {
        await processValue(val);
      }
    }
  };

  if (typeof exports === 'string') {
    await processValue(exports);
  } else if (typeof exports === 'object') {
    for (const value of Object.values(exports)) {
      await processValue(value);
    }
  }

  return exportedFiles;
};
