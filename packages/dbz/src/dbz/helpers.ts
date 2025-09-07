import { getRootPkgJSON } from '@goatjs/node/package-json';
import { execAsync } from '@goatjs/node/exec';

export const isMonorepo = async () => {
  const pkg = await getRootPkgJSON();
  return Array.isArray(pkg.workspaces);
};

interface YarnConfig {
  key: string;
  effective: string;
  source: string;
  description: string;
  type: 'STRING';
  default: null;
}

export const getPublishRegistryUrl = async () => {
  const { stdout } = await execAsync('yarn config npmPublishRegistry --json');
  const json = JSON.parse(stdout) as YarnConfig;
  return json.effective;
};

export const getAccessToken = async () => {
  const { stdout } = await execAsync('gcloud auth print-access-token');
  return stdout.trim();
};
