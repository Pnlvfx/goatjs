#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { deployToVps, restartVps } from './index.ts';

await yargs(hideBin(process.argv))
  .scriptName('vps')
  .strict()
  .help()
  .demandCommand(1, 'You must specify a command.')
  .command(
    'deploy',
    'Deploy the project to the VPS',
    (y) =>
      y
        .option('init', { type: 'boolean', alias: 'i', description: 'Run first-time initialisation on the server', default: false })
        .option('update', { type: 'boolean', alias: 'u', description: 'Update system packages before deploying', default: false }),
    async ({ init, update }) => {
      await deployToVps({ init, update });
    },
  )
  .command('restart', 'Restart the VPS pm2 process via SSH', {}, async () => {
    await restartVps();
  })
  .parseAsync();
