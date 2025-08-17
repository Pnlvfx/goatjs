import { git } from '@goatjs/node/git/git';
import { spawnWithLog } from '@goatjs/node/spawn';
import { releaseChangelog, releasePublish, releaseVersion } from 'nx/release/index.js';
import yargs from 'yargs';

const options = await yargs(process.argv.slice(2))
  .version(false)
  .option('version', { description: 'Explicit version specifier to use, if overriding conventional commits', type: 'string' })
  .option('dryRun', {
    alias: 'd',
    default: true,
    description: 'Whether to perform a dry-run of the release process, defaults to true',
    type: 'boolean',
  })
  .option('forceReleaseWithoutChanges', {
    default: false,
    description: 'Whether to do a release regardless of if there have been changes',
    type: 'boolean',
  })
  .option('verbose', {
    default: false,
    description: 'Whether or not to enable verbose logging, defaults to false',
    type: 'boolean',
  })
  .option('firstRelease', { default: false })
  .parseAsync();

const { projectsVersionData, workspaceVersion } = await releaseVersion({
  specifier: options.version,
  dryRun: options.dryRun,
  stageChanges: true,
  verbose: options.verbose,
  firstRelease: options.firstRelease,
});

if (!options.dryRun) {
  console.log('⏳ Updating yarn.lock...');
  await spawnWithLog('yarn', ['install']);
  await git.add('yarn.lock');
  console.log('✅ Updated and staged yarn.lock\n');
}

await releaseChangelog({
  dryRun: options.dryRun,
  verbose: options.verbose,
  version: workspaceVersion,
  versionData: projectsVersionData,
  firstRelease: options.firstRelease,
});

if (!options.forceReleaseWithoutChanges && workspaceVersion === null) {
  throw new Error('⏭️ No changes detected across any package, skipping publish step altogether');
}

const publishProjectsResult = await releasePublish({
  dryRun: options.dryRun,
  verbose: options.verbose,
  firstRelease: options.firstRelease,
});

const hasError = Object.values(publishProjectsResult).some(({ code }) => code !== 0);
if (hasError) {
  throw new Error('Release fail');
}
