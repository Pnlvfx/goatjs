import { getRootPkgJSON } from '@goatjs/node/package-json';

export const isMonorepo = async () => {
  const pkg = await getRootPkgJSON();
  return Array.isArray(pkg.workspaces);
};
