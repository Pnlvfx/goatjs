import { execAsync } from '@goatjs/node/exec';

export const addAccessToken = async () => {
  await execAsync('yarn config set npmAuthToken $(gcloud auth print-access-token)');
};
