export interface UnusedOptions {
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
