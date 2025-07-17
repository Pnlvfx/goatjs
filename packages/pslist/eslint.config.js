import { goateslint } from '@goatjs/node-monorepo-eslint';

export default goateslint({ ignores: ['dist'], tsconfigRootDir: import.meta.dirname });
