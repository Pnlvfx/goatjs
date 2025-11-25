import { consoleColor } from '@goatjs/node/console-color';
import { getNextArg } from './cli-helpers.js';
import { isValidYarnVersion } from './dbz/publish.js';
import { dbz } from './dbz/index.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

await yargs(hideBin(process.argv))
  .version(false)
  .strict()
  .help()
  .scriptName('dbz')
  .usage('$0 <cmd> [args]')
  .command(
    'publish [version]',
    'Publish the package',
    (yargs) => {
      return yargs.positional('version', { type: 'string', describe: 'Version to publish' });
    },
    async (argv) => {
      const version = argv.version && isValidYarnVersion(argv.version) ? argv.version : undefined;
      await dbz.publish({ version });
    },
  )
  .command(
    'unpublish [package]',
    'Unpublish a package',
    (yargs) => {
      return yargs.positional('package', {
        type: 'string',
        describe: 'Package name to unpublish',
      });
    },
    async (argv) => {
      const pkgName = argv.package ?? getNextArg(hideBin(process.argv).slice(1), false);
      await dbz.unpublish(pkgName);
    },
  )
  .command('clear', 'Clear the project', {}, async () => {
    await dbz.clear();
    consoleColor('blue', 'Project cleaned.');
  })
  .demandCommand(1, 'You need at least one command before moving on')
  .parseAsync();
