import { getRootPkgJSON } from '@goatjs/node/package-json';
import fs from 'node:fs/promises';

export const getProjectName = async () => {
  const { name } = await getRootPkgJSON();
  /** if name is @goatjs/core scope is @goatjs and scopeName is core
   * but if name is core scope is core and scopeName is undefined
   */
  const [scope, scopeName] = name.split('/');
  return { scope: scope?.replace('@', ''), name: scopeName ?? name.replace('api-', '') };
};

export const mkDir = async (folder: string, recursive?: boolean) => {
  try {
    await fs.mkdir(folder, { recursive });
  } catch {}
};
