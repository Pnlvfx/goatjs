import { getRootPkgJSON } from '@goatjs/node/package-json';
import fs from 'node:fs/promises';

export const getProjectName = async () => {
  const { name } = await getRootPkgJSON();
  const [scope, scopeName] = name.split('/');
  return { scope: scope?.slice(1), name: scopeName ?? name.replace('api-', '') };
};

export const mkDir = async (folder: string, recursive?: boolean) => {
  try {
    await fs.mkdir(folder, { recursive });
  } catch {}
};
