import path from 'node:path';
import { analyzeTsConfig } from 'ts-unused-exports';
import { getEntries } from '../typed-object.js';

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

/** Find all the unused variables in your code. */
export const findUnusedExports = ({
  ignoreFiles,
  ignoreVars,
  ignoreFolders,
  tsConfigPath = path.resolve('.', 'tsconfig.json'),
  // eslint-disable-next-line sonarjs/cognitive-complexity
}: UnusedOptions = {}) => {
  const analyzed = analyzeTsConfig(tsConfigPath);
  const response: Record<string, ExportNameAndLocation[]> = {};
  const unusedFolders = new Set(ignoreFolders);
  for (const [filePath, value] of getEntries(analyzed.unusedExports)) {
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
    throw new Error(`The following ignore entries are no longer needed: Variables: ${[...unusedFolders].join(', ')}`);
  }

  return Object.keys(response).length > 0 ? response : undefined;
};
