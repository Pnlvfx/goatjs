import { updateLocalDeps } from '@goatjs/updater';

// yarn dlx @turbo/codemod@latest update
await updateLocalDeps({
  '@goatjs/eslint': 'github:Pnlvfx/eslint-legacy',
  '@goatjs/typescript-config': 'github:Pnlvfx/typescript-config',
});
