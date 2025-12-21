import fs from 'node:fs/promises';

export interface PackageJSON {
  name: string;
  description?: string;
  scripts?: Record<string, string>;
  workspaces?: string[];
  author?: string | object;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  packageManager?: string;
  exports?: Record<string, string | object> | null;
}

export const getRootPkgJSON = async () => {
  const buf = await fs.readFile('package.json');
  const { name, ...pkg } = JSON.parse(buf.toString()) as Partial<PackageJSON>;
  if (!name) throw new Error('Please add a valid name on your package.json.');
  return { name, ...pkg };
};
