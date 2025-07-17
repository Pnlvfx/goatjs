import { execAsync } from '@goatjs/node/exec';
import { git } from 'git';

// even if we don't provide @goatjs/node it should still work
// as it's on the root node_modules

const changes = await git.status({ porcelain: true });
if (changes) throw new Error('You have uncommitted changes, please resolve them before continuing...');

await execAsync('yarn workspaces foreach --all --no-private version patch');
await git.add();
await git.commit('RELEASE');
await git.push();

await execAsync('yarn workspaces foreach --all --no-private npm publish');
