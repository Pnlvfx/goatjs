import { spawnWithLog } from '@goatjs/dbz/spawn';
import { rimraf } from '../src/rimraf.ts';

await rimraf(['dist', 'tsconfig.build.tsbuildinfo']);
await spawnWithLog('eslint');
await spawnWithLog('tsc', ['-p', 'tsconfig.build.json']);
