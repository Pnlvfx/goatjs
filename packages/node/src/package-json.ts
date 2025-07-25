import fs from 'node:fs/promises';

interface PkgJSON {
  name?: string;
  workspaces?: string[];
}

export const getRootPkgJSON = async () => {
  const buf = await fs.readFile('package.json');
  const { name } = JSON.parse(buf.toString()) as PkgJSON;
  if (!name) throw new Error('Please add a valid name on your package.json.');
  return { name };
};
