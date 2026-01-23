import { dbz } from '@goatjs/dbz/dbz';
import { spawnWithLog } from '@goatjs/dbz/spawn';

await spawnWithLog('yarn', ['build']);
await dbz.publish({ skipClear: true });
