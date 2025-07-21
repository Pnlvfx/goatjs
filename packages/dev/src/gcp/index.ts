import { execAsync } from '@goatjs/node/exec';
import { resolvePrivateGitDependencies } from './git.js';
import { resolveVerdaccioDependencies } from './verdaccio/verdaccio.js';

export const gcp = {
  appEngine: {
    resolvePrivateGitDependencies,
    resolveVerdaccioDependencies,
    deploy: async (projectName: string) => {
      await execAsync(`gcloud config set project ${projectName}`);
      await execAsync('gcloud app deploy -q');
    },
  },
};
