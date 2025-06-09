import path from 'node:path';
import { analyzeTsConfig } from 'ts-unused-exports';
import fs from 'node:fs/promises';
import { patchSkipVanillaCssFiles } from './patch-vanilla.js';

interface UnusedOptions {
  tsConfigPath?: string;
  ignoreVars?: string[];
  ignoreFiles?: string[];
  ignoreFolders?: string[];
}

export interface LocationInFile {
  line: number;
  character: number;
}
interface ExportNameAndLocation {
  exportName: string;
  location: LocationInFile;
}

export type UnusedResponse = Record<string, ExportNameAndLocation[]>;

/** Find all the unused variables in your code. */
export const findUnusedExports = async ({
  ignoreFiles,
  ignoreVars,
  ignoreFolders,
  tsConfigPath = path.resolve('.', 'tsconfig.json'),
  // eslint-disable-next-line sonarjs/cognitive-complexity
}: UnusedOptions = {}) => {
  // eslint-disable-next-line no-restricted-properties
  await fs.access(tsConfigPath);
  const analyzed = analyzeTsConfig(tsConfigPath);
  const response: UnusedResponse = {};
  const unusedFolders = new Set(ignoreFolders);
  for (const [filePath, value] of Object.entries(analyzed.unusedExports)) {
    const filename = path.basename(filePath.toString());
    const folderPath = path.dirname(filePath.toString());

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

  const patchedResponse = patchSkipVanillaCssFiles(response);

  return Object.keys(patchedResponse).length > 0 ? patchedResponse : undefined;
};
