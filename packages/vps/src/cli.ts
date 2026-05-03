#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { deployToVps } from './commands/deploy.ts';
import { restartVps } from './commands/restart.ts';
import { connectToVps } from './commands/connect.ts';
import { runPluginByName } from './commands/plugin.ts';
import { vpsStatus } from './commands/status.ts';
import { vpsLogs } from './commands/logs.ts';
import { rollbackVps } from './commands/rollback.ts';

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
  .command('rollback', 'Roll back to the previous release on the VPS', {}, async () => {
    await rollbackVps();
  })
  .command('logs', 'Show pm2 logs from the VPS', {}, async () => {
    await vpsLogs();
  })
  .command('status', 'Show pm2 process status on the VPS', {}, async () => {
    await vpsStatus();
  })
  .command('connect', 'Start an interactive SSH session on the VPS', {}, async () => {
    await connectToVps();
  })
  .command(
    'plugin <name>',
    'Run a user-defined plugin by name',
    (y) => y.positional('name', { type: 'string', description: 'Plugin name to run', demandOption: true }),
    async ({ name }) => {
      await runPluginByName(name);
    },
  )
  .parseAsync();
