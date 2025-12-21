import { getRootPkgJSON } from '@goatjs/node/package-json';
import path from 'node:path';

export const getExportedFiles = async () => {
  const pkgJson = await getRootPkgJSON();
  const exports = pkgJson.exports;
  const exportedFiles = new Set<string>();

  if (!exports) return exportedFiles;

  const processValue = (value: unknown) => {
    if (typeof value === 'string') {
      // Handle direct string exports like "./dist/index.js"
      exportedFiles.add(path.resolve(value));
    } else if (typeof value === 'object' && value !== null) {
      // Handle conditional exports like { "import": "./dist/index.js", "require": "./dist/index.cjs" }
      for (const val of Object.values(value)) {
        processValue(val);
      }
    }
  };

  if (typeof exports === 'string') {
    processValue(exports);
  } else if (typeof exports === 'object') {
    for (const value of Object.values(exports)) {
      processValue(value);
    }
  }

  return exportedFiles;
};
