/* eslint-disable no-console */
import { consoleColor } from '@goatjs/node/console-color';
import { getNextArg } from './cli-helpers.js';
import { getPublishRegistryUrl } from './dbz/helpers.js';
import { isValidYarnVersion } from './dbz/publish.js';
import { dbz } from './dbz/index.js';
import { spawnStdio } from '@goatjs/node/terminal/stdio';

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case 'auth': {
    console.log('🔐 Setting YARN_NPM_AUTH_TOKEN...');
    await dbz.createYarnEnv();
    console.log('✅ Authentication token set successfully!');
    break;
  }
  case 'publish': {
    const versionInput = args.at(0);
    const version = versionInput && isValidYarnVersion(versionInput) ? versionInput : undefined;
    await dbz.publish({ version });
    break;
  }
  case 'unpublish': {
    const pkgName = getNextArg(args, false);
    await spawnStdio('npm', ['unpublish', pkgName, '--force', '--registry', await getPublishRegistryUrl()]);
    break;
  }
  case 'clear': {
    await dbz.clear();
    consoleColor('blue', 'Project cleaned.');
    break;
  }
  default: {
    throw new Error('Invalid or empty command received');
  }
}
