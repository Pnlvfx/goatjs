import { getRootPkgJSON } from '@goatjs/node/package-json';

export const getProjectName = async () => {
  const { name } = await getRootPkgJSON();
  /** if name is @goatjs/core scope is @goatjs and scopeName is core
   * but if name is core scope is undefined and scopeName is core
   */
  const parts = name.split('/');
  if (parts.length !== 1 && parts.length !== 2) throw new Error('invalid package.json name');
  const scope = parts.length > 1 ? parts.at(0)?.slice(1) : '';
  const scopeName = parts.length > 1 ? parts.at(1) : parts.at(0);
  if (!scopeName) throw new Error('unable to parse ackage name');
  return { scope, name: scopeName.replace('api-', '') };
};
