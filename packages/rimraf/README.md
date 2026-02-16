# @goatjs/rimraf

A cross-platform file and directory deletion utility (like `rm -rf`).

## Installation

```bash
npm install @goatjs/rimraf
```

## Exports

### `rimraf`

Recursively deletes files and directories.

**Signature:**

```typescript
export const rimraf: (paths: string | string[]) => Promise<void>;
```

**Parameters:**

- `paths` (string | string[]): A single path or array of paths to delete

**Returns:** Promise<void>

**Example:**

```typescript
import { rimraf } from '@goatjs/rimraf';

// Delete a single directory
await rimraf('dist');

// Delete multiple paths
await rimraf(['node_modules', 'dist', '.cache']);

// Delete a file
await rimraf('old-file.txt');
```

### CLI Usage

The package also includes a CLI command:

```bash
npx rimraf <path1> [path2] [path3...]
```

**Example:**

```bash
# Delete single directory
npx rimraf dist

# Delete multiple paths
npx rimraf node_modules dist .cache
```

## Features

- Cross-platform (works on Windows, macOS, Linux)
- Force deletion (no prompts)
- Recursive deletion of directories
- Handles non-existent paths gracefully

## Behavior

- Uses `fs.rm` with `recursive: true` and `force: true`
- Does not throw if paths don't exist
- Deletes directories and all their contents
