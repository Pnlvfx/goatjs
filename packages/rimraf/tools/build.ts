import { spawnWithLog } from '@goatjs/dbz/spawn';
import { rimraf } from '../src/rimraf.ts';

await rimraf('dist');
await spawnWithLog('eslint');
await spawnWithLog('tsc', ['-p', 'tsconfig.build.json']);
