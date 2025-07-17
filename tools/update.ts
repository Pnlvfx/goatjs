import { updateLocalDeps } from '@goatjs/updater';

// yarn dlx @turbo/codemod@latest update
await updateLocalDeps({
  '@goatjs/typescript-config': 'github:Pnlvfx/typescript-config',
  git: 'github:Pnlvfx/git',
});
