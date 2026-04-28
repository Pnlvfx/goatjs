/* eslint-disable no-console */
import { checkGitStatus } from '@goatjs/dbz/git';
import { execAsync } from '@goatjs/node/exec';
import { createGitClient } from '@goatjs/node/git';
import { rimraf } from '@goatjs/rimraf';
import { preDeploy } from './pre.ts';
import { execa } from 'execa';

export const gcp = {
  appEngine: {
    deploy: async (projectName: string) => {
      const git = createGitClient();
      await checkGitStatus();

      const reset = async () => {
        await git.checkout('.yarnrc.yml package.json');
        await execa('yarn', { stdio: 'inherit' }); // predeploy remove some packages and we have to add them back
      };

      try {
        const startTime = Date.now();
        await rimraf('dist');
        await execa('yarn', ['build'], { stdio: 'inherit' });
        await preDeploy(); // temp for gcp machine only
        await execAsync('yarn config set enableGlobalCache false');
        await execAsync(`gcloud config set project ${projectName}`);
        await execa('gcloud', ['app', 'deploy', '-q'], { stdio: 'inherit' });
        await reset();
        await execa('yarn', ['version', 'minor'], { stdio: 'inherit' });
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
