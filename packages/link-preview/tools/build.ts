import { rimraf } from '@goatjs/rimraf';
import { execa } from 'execa';

await rimraf('dist');
await execa('eslint', { stdio: 'inherit' });
await execa('tsc', ['-p', 'tsconfig.build.json'], { stdio: 'inherit' });
