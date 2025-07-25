import { execAsync } from '@goatjs/node/exec';
import { getNextArg } from './cli-helpers.js';
import { getPublishRegistryUrl, isMonorepo } from './helpers.js';
import { verdy } from './index.js';
import { consoleColor } from '@goatjs/node/console-color';

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case 'publish': {
    if (args.length > 0) throw new Error("Publish doesn't accept args for now");
    if (await isMonorepo()) {
      consoleColor('yellow', "Verdy detect that you're running in a monorepo. Please ensure to run this scripts from the root only.");
      await verdy.monorepo.publish();
    } else {
      await verdy.publish();
    }
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
