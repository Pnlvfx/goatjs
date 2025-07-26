/* eslint-disable no-console */
import { execAsync } from '@goatjs/node/exec';
import { getNextArg } from './cli-helpers.js';
import { getPublishRegistryUrl } from './dbz/helpers.js';
import { consoleColor } from '@goatjs/node/console-color';
import { isValidYarnVersion, supportedVersions } from './dbz/publish.js';
import { dbz } from './dbz/index.js';

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case 'auth': {
    console.log('🔐 Setting YARN_NPM_AUTH_TOKEN...');
    await dbz.auth();
    console.log('✅ Authentication token set successfully!');
    console.log('You can now run yarn commands that require authentication.');
    break;
  }
  case 'add': {
    await dbz.add(args);
    break;
  }
  case 'update': {
    await dbz.update();
    break;
  }
  case 'publish': {
    console.time('publish');
    const version = args.at(0) ?? 'patch';
    if (!isValidYarnVersion(version)) throw new Error(`Unsupported version. Valid versions ${supportedVersions.join(', ')}`);
    await dbz.publish({ version });
    console.timeEnd('publish');
    break;
  }
  case 'unpublish': {
    const pkgName = getNextArg(args, false);
    const { stdout } = await execAsync(`npm unpublish ${pkgName} --force --registry ${await getPublishRegistryUrl()}`);
    consoleColor('blue', stdout);
    break;
  }
  default: {
    throw new Error('Invalid or empty command received');
  }
}
