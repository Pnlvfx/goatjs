/* eslint-disable no-console */
import { checkGitStatus } from '@goatjs/dbz/git';
import { spawnWithLog } from '@goatjs/dbz/spawn';
import { execAsync } from '@goatjs/node/exec';
import { createGitClient } from '@goatjs/node/git';
import { rimraf } from '@goatjs/rimraf';
import { preDeploy } from './pre.ts';

export const gcp = {
  appEngine: {
    deploy: async (projectName: string) => {
      const git = createGitClient();
      await checkGitStatus();

      const reset = async () => {
        await git.checkout('.yarnrc.yml package.json');
        await spawnWithLog('yarn'); // predeploy remove some packages and we have to add them back
      };

      try {
        const startTime = Date.now();
        await rimraf('dist');
        await spawnWithLog('yarn', ['build']);
        await preDeploy(); // temp for gcp machine only
        await execAsync('yarn config set enableGlobalCache false');
        await execAsync(`gcloud config set project ${projectName}`);
        await spawnWithLog('gcloud', ['app', 'deploy', '-q']);
        await reset();
        await spawnWithLog('yarn', ['version', 'minor']);
        await git.add();
        await git.commit('RELEASE');
        await git.push();

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log('═══════════════════════════════════════════════════════════');
        console.log('🎉 DEPLOYMENT COMPLETED SUCCESSFULLY!');
        console.log(`⏱️ Total time: ${duration} seconds`);
        console.log('═══════════════════════════════════════════════════════════');
      } catch (err) {
        await reset();
        throw err;
      }
    },
  },
};
