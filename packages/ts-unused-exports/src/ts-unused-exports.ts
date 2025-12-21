import type { UnusedOptions, UnusedResponse } from './types.js';
import path from 'node:path';
import fs from 'node:fs/promises';
import { analyzeTsConfig } from 'ts-unused-exports';
import { getExportedFiles } from './exports.js';
import { patchVanillaCssFiles } from './vanilla-2.js';

/** Find all the unused variables in your code. */
export const findUnusedExports = async ({
  ignoreFiles,
  ignoreVars,
  ignoreFolders,
  tsConfigPath = path.resolve('.', 'tsconfig.json'),
  // eslint-disable-next-line sonarjs/cognitive-complexity
}: UnusedOptions = {}) => {
  await fs.access(tsConfigPath);
  const exportedFiles = await getExportedFiles();

  const analyzed = analyzeTsConfig(tsConfigPath);
  const response: UnusedResponse = {};
  const unusedFolders = new Set(ignoreFolders);

  for (const [filePath, value] of Object.entries(analyzed.unusedExports)) {
    const resolvedFilePath = path.resolve(filePath);
    const filename = path.basename(filePath);
    const folderPath = path.dirname(filePath);

    // Skip files that are exported in package.json
    if (exportedFiles.has(resolvedFilePath)) continue;

    const withoutExt = resolvedFilePath.replace(/\.(ts|tsx|js|jsx|mts|cts)$/, '');
    const isExported = [...exportedFiles].some((exportedFile) => {
      const exportedWithoutExt = exportedFile.replace(/\.(ts|tsx|js|jsx|mts|cts|mjs|cjs)$/, '');
      return exportedWithoutExt === withoutExt;
    });

    if (isExported) continue;

    // Skip files in ignored folders
    const isIgnoredFolder = ignoreFolders?.some((ignoredFolder) => {
      if (folderPath.startsWith(path.resolve(ignoredFolder))) {
        unusedFolders.delete(ignoredFolder); // Mark folder as used
        return true;
      }
      return false;
    });

    if (isIgnoredFolder) continue;

    if (ignoreFiles?.includes(filename)) {
      ignoreFiles.splice(ignoreFiles.indexOf(filename), 1);
      continue;
    }

    const filteredExports = [];

    for (const v of value) {
      if (ignoreVars?.includes(v.exportName)) {
        ignoreVars.splice(ignoreVars.indexOf(v.exportName), 1);
      } else {
        filteredExports.push(v);
      }
    }

    if (filteredExports.length > 0) {
      response[filePath] = filteredExports;
    }
  }

  if (ignoreFiles && ignoreFiles.length > 0) {
    throw new Error(`The following ignore entries are no longer needed: Files: ${ignoreFiles.join(',\n')}`);
  }

  if (ignoreVars && ignoreVars.length > 0) {
    throw new Error(`The following ignore entries are no longer needed: Variables: ${ignoreVars.join(', ')}`);
  }

  if (unusedFolders.size > 0) {
    throw new Error(`The following ignore entries are no longer needed: Folders: ${[...unusedFolders].join(', ')}`);
  }

  const patchedResponse = await patchVanillaCssFiles(response);

  return Object.keys(patchedResponse).length > 0 ? patchedResponse : undefined;
};

export type * from './types.js';
