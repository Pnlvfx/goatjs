import { updateLocalDeps } from '@goatjs/updater';

// yarn dlx @turbo/codemod@latest update
await updateLocalDeps({
  '@goatjs/node-monorepo-eslint': '^1.0.4',
  '@goatjs/typescript-config': 'github:Pnlvfx/typescript-config',
});
