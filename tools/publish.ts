import { dbz } from '@goatjs/dbz/dbz';

await dbz.publish();
    await execAsync('yarn workspaces foreach --all run rimraf dist');
