import { rimraf } from '@goatjs/rimraf';
import { spawnWithLog } from '@goatjs/dbz/spawn';

await rimraf('dist');
await spawnWithLog('eslint');
await spawnWithLog('tsc', ['-p', 'tsconfig.build.json']);
