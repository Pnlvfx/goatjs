import { nodeMonorepoConfigs } from '@goatjs/node-monorepo-eslint';
import { defineConfig } from '@eslint/config-helpers';

export default defineConfig([{ ignores: ['dist'] }, ...nodeMonorepoConfigs({ tsconfigRootDir: import.meta.dirname })]);
