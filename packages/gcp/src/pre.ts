import { getRootPkgJSON } from '@goatjs/node/package-json';
import { execa } from 'execa';
import fs from 'node:fs/promises';

/** hack to lower the bundle size as we experienced some crash during the build while deploying */
export const preDeploy = async () => {
  const jsonContent = await getRootPkgJSON();
  jsonContent.devDependencies = {};
  await fs.writeFile('package.json', JSON.stringify(jsonContent));
  await execa('yarn', { stdio: 'inherit' });
};
