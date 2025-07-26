import { execAsync } from '@goatjs/node/exec';

export const getAccessToken = async () => {
  const { stdout } = await execAsync('gcloud auth print-access-token');
  return stdout.trim();
};
