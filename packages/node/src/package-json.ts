import fs from 'node:fs/promises';

interface PkgJSON {
  name?: string;
  description?: string;
  scripts?: Record<string, string>;
  workspaces?: string[];
  author?: string | object;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

export const getRootPkgJSON = async () => {
  const buf = await fs.readFile('package.json');
  const { name, workspaces } = JSON.parse(buf.toString()) as PkgJSON;
  if (!name) throw new Error('Please add a valid name on your package.json.');
  return { name, workspaces };
};
