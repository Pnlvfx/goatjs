/* eslint-disable no-console */
import { execAsync } from '@goatjs/node/exec';
import { getNextArg } from './cli-helpers.js';
import { getPublishRegistryUrl } from './helpers.js';
import { verdy } from './index.js';
import { consoleColor } from '@goatjs/node/console-color';
import { isValidYarnVersion, supportedVersions } from './publish.js';

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case 'publish': {
    console.time('publish');
    const version = args.at(0) ?? 'patch';
    if (!isValidYarnVersion(version)) throw new Error(`Unsupported version. Valid versions ${supportedVersions.join(', ')}`);
    await verdy.publish({ version });
    console.time('publish');
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
