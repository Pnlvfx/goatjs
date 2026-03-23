import { rimraf } from '@goatjs/rimraf';
import { spawnWithLog } from '@goatjs/dbz/spawn';

await rimraf(['dist', 'tsconfig.build.tsbuildinfo']);
await spawnWithLog('eslint');
await spawnWithLog('tsc', ['-p', 'tsconfig.build.json']);
