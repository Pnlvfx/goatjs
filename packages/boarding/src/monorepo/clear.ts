import { execAsync } from '@goatjs/node/exec';
import { rimraf } from '@goatjs/rimraf';

export const clearMonorepoCache = async () => {
    await rimraf('.turbo');
await execAsync('yarn workspaces foreach --all run rimraf dist');
await execAsync('yarn workspaces foreach --all run rimraf .turbo');
}
