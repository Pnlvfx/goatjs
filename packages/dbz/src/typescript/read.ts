/* eslint-disable no-restricted-properties */
import path from 'node:path';
import ts from 'typescript';

export const getProjectTsConfig = () => {
  const tsconfigPath = path.resolve(process.cwd(), 'tsconfig.build.json');
  const configFile = ts.readConfigFile(tsconfigPath, (path) => ts.sys.readFile(path));

  if (configFile.error) {
    throw new Error(
      ts.formatDiagnostic(configFile.error, {
        getCanonicalFileName: (f: string) => f,
        getCurrentDirectory: () => process.cwd(),
        getNewLine: () => '\n',
      }),
    );
  }

  return ts.parseJsonConfigFileContent(
    configFile.config,
    {
      fileExists: (path) => ts.sys.fileExists(path),
      readFile: (path) => ts.sys.readFile(path),
      readDirectory: (path, extensions, exclude, include, depth) => ts.sys.readDirectory(path, extensions, exclude, include, depth),
      useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
    },
    path.dirname(tsconfigPath),
  );
};
