import { updateLocalDeps } from '@goatjs/updater';
import { promisify } from 'node:util';
import { exec } from 'node:child_process';

const execAsync = promisify(exec);
await execAsync('yarn dlx @turbo/codemod@latest update');
await updateLocalDeps({});
