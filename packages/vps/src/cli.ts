import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { loadConfigFile } from './config.ts';
import { deployToVps } from './index.ts';

const { init, update, skipGit } = await yargs(hideBin(process.argv))
  .option('init', { type: 'boolean', alias: 'i' })
  .option('update', { type: 'boolean', alias: 'u' })
  .option('skip-git', { type: 'boolean' })
  .parseAsync();

const { host, projectName, plugins } = await loadConfigFile();
await deployToVps({ host, projectName, init, skipGit, update });
