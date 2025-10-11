import { nodeMonorepoConfigs } from '@goatjs/node-monorepo-eslint';
import { defineConfig } from '@eslint/config-helpers';

export default defineConfig(nodeMonorepoConfigs({ ignores: ['dist'], tsconfigRootDir: import.meta.dirname }));
