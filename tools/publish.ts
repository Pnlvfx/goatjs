import { verdaccio } from '@goatjs/dev/verdaccio';
import { execAsync } from '@goatjs/node/exec';

// only on this monorepo we need to be sure to build the packages before running this
// or we will publish using old builds.
await execAsync('yarn build');
await verdaccio.publishAll();
