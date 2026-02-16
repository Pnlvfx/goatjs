# @goatjs/node

Node.js utility functions for file system operations, process management, and CLI helpers.

## Installation

```bash
npm install @goatjs/node
```

## Exports

All modules are exported via wildcard (`"./*": "./src/*.ts"`), so you can import any file directly.

### Bash Utilities (`@goatjs/node/bash`)

#### `parseBashOptions`

Parses an options object into bash command arguments.

```typescript
import { parseBashOptions } from '@goatjs/node/bash';
const args = parseBashOptions({ verbose: true, output: 'file.txt' });
// Returns: '--verbose --output file.txt'
```

### Git Operations (`@goatjs/node/git`)

#### `createGitClient`

Creates a git client with common git operations.

```typescript
import { createGitClient } from '@goatjs/node/git';

const git = createGitClient({ cwd: './my-project' });
await git.add();
await git.commit('Initial commit');
await git.push();
await git.pull();
await git.fetch();
```

### Process Execution (`@goatjs/node/exec`)

#### `execAsync`

Promisified version of Node's `exec`.

```typescript
import { execAsync, execFileAsync } from '@goatjs/node/exec';
const { stdout } = await execAsync('ls -la');
const { stdout } = await execFileAsync('node', ['--version']);
```

### Terminal Operations (`@goatjs/node/terminal`)

#### `terminal`

Opens a new terminal window with a script.

```typescript
import { terminal } from '@goatjs/node/terminal';
const child = terminal('./start-server.sh');
```

### Console Output (`@goatjs/node/console-color`, `@goatjs/node/log`)

#### `consoleColor`

Logs messages with colors to the console.

```typescript
import { consoleColor } from '@goatjs/node/console-color';
consoleColor('red', 'Error message');
consoleColor('green', 'Success!');
consoleColor('blue', 'Info message');
```

#### `inspectLog`

Deep inspects and logs objects with colors.

```typescript
import { inspectLog } from '@goatjs/node/log';
inspectLog({ nested: { deep: { value: 'test' } } });
```

### User Input (`@goatjs/node/input`)

#### `input`

Prompts user for CLI input.

```typescript
import { input } from '@goatjs/node/input';
const name = await input.create({ title: 'Enter your name:', color: 'blue' });
input.abort(); // Abort current input
```

### Temporary Files (`@goatjs/node/tempy`, `@goatjs/node/tempy-sync`)

```typescript
import { temporaryFile, temporaryDirectory } from '@goatjs/node/tempy';
import { temporaryFileSync, temporaryDirectorySync } from '@goatjs/node/tempy-sync';

const file = await temporaryFile({ extension: 'txt' });
const dir = await temporaryDirectory({ prefix: 'myapp-' });
const fileSync = temporaryFileSync({ name: 'myfile.json' });
```

### Package.json (`@goatjs/node/package-json`)

#### `getRootPkgJSON`

Reads and parses the root package.json.

```typescript
import { getRootPkgJSON } from '@goatjs/node/package-json';
const pkg = await getRootPkgJSON();
```

### File System Extensions (`@goatjs/node/fs-extra`, `@goatjs/node/fs-extra/*`)

```typescript
import { fsExtra } from '@goatjs/node/fs-extra';
import { isJunk } from '@goatjs/node/fs-extra/junk';
import { validatePath } from '@goatjs/node/fs-extra/windows';

const files = await fsExtra.readdir('./mydir');
const exists = await fsExtra.exist('./file.txt');
await fsExtra.clearFolder('./cache');
isJunk('.DS_Store'); // true
```

### User Agent (`@goatjs/node/user-agent`)

#### `getUserAgent`

Returns a Chrome User-Agent string for the current platform.

```typescript
import { getUserAgent } from '@goatjs/node/user-agent';
const ua = getUserAgent();
```

### Environment (`@goatjs/node/prod`)

#### `isProduction`

Checks if running in production environment.

```typescript
import { isProduction } from '@goatjs/node/prod';
if (isProduction) {
  /* production code */
}
```

### File Utilities (`@goatjs/node/sanitize`, `@goatjs/node/truncate-utf8-bytes`, `@goatjs/node/copy-files-from-folder`)

```typescript
import { sanitize } from '@goatjs/node/sanitize';
import { truncate } from '@goatjs/node/truncate-utf8-bytes';
import { copyFilesFromFolder } from '@goatjs/node/copy-files-from-folder';

sanitize('file:name?.txt'); // 'filename.txt'
truncate('Hello World', 5); // 'Hello'
await copyFilesFromFolder({ inputFolder: './src', outputFolder: './dist', files: '*' });
```

### Code Generation (`@goatjs/node/mark`)

#### `mark`

Returns a comment marker for generated files.

```typescript
import { mark } from '@goatjs/node/mark';
const content = `${mark()}\n\nexport const data = {};`;
```

### Prettier (`@goatjs/node/prettier`)

```typescript
import { prettier } from '@goatjs/node/prettier';
const formatted = await prettier.format(code, { parser: 'typescript' });
```
