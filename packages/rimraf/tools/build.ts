import { execa } from 'execa';
import { rimraf } from '../src/rimraf.ts';

await rimraf('dist');
await execa('eslint', { stdio: 'inherit' });
await execa('tsc', ['-p', 'tsconfig.build.json'], { stdio: 'inherit' });
