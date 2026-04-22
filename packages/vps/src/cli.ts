import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { deployToVps } from './index.ts';

const { init, update, skipGit } = await yargs(hideBin(process.argv))
  .option('init', { type: 'boolean', alias: 'i' })
  .option('update', { type: 'boolean', alias: 'u' })
  .option('skip-git', { type: 'boolean' })
  .parseAsync();

await deployToVps({ init, skipGit, update });
