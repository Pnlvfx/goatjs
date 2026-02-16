# @goatjs/storage

Persistent storage utilities for Node.js applications with support for files, stores, and logging.

## Installation

```bash
npm install @goatjs/storage
```

## Exports

### Main Storage (`@goatjs/storage`)

#### `storage`

Main storage object for managing directories and static files.

```typescript
export const storage: {
  /** Current working directory for storage */
  readonly cwd: string;
  /** Creates and returns a directory path */
  use: (dir: string, options?: { root?: boolean }) => Promise<string>;
  /** Creates static file directories (images, videos) */
  useStatic: () => Promise<{ staticPath: string; imagePath: string; videoPath: string }>;
  /** Deletes all storage for the current project */
  clearAll: () => Promise<void>;
  /** Converts a local static path to a URL */
  getUrlFromStaticPath: (coraPath: string, options: { host: string }) => string;
  /** Converts a static URL to a local file path */
  getPathFromStaticUrl: (url: string) => string;
};
```

**Example:**

```typescript
import { storage } from '@goatjs/storage';

// Create a directory
const cacheDir = await storage.use('cached');

// Create static directories
const { staticPath, imagePath, videoPath } = await storage.useStatic();

// Convert paths
const url = storage.getUrlFromStaticPath('/path/to/static/image.jpg', {
  host: 'https://example.com',
});
const localPath = storage.getPathFromStaticUrl('https://example.com/static/image.jpg');
```

### Store (`@goatjs/storage/store`)

#### `createStore`

Creates a persistent key-value store with schema validation.

**Signature:**

```typescript
export const createStore: <T extends z.ZodType>(
  name: string,
  schema: T,
  options?: { root?: string },
) => Promise<{
  get: () => Promise<z.infer<T> | undefined>;
  set: (data: Partial<z.infer<T>>) => Promise<void>;
  clear: () => Promise<void>;
}>;
```

**Example:**

```typescript
import { createStore } from '@goatjs/storage/store';
import * as z from 'zod';

const userSchema = z.strictObject({
  id: z.string(),
  name: z.string(),
  email: z.string(),
});

const userStore = await createStore('users', userSchema);

// Set data
await userStore.set({ id: '1', name: 'John', email: 'john@example.com' });

// Get data
const user = await userStore.get();

// Clear data
await userStore.clear();
```

### Logger (`@goatjs/storage/logger`)

#### `logger`

File-based logging utility with Prettier formatting support.

```typescript
export const logger: {
  /** Write data to a log file */
  toFile: (data: string, options?: FileOptions) => Promise<void>;
  /** Delete a log file */
  delete: (name: string) => Promise<void>;
  /** Delete all log files */
  deleteAll: () => Promise<void>;
};
```

#### FileOptions Interface

```typescript
interface FileOptions {
  extension?: 'json' | 'typescript' | 'babel' | 'txt' | 'xml';
  name?: string;
  unique?: boolean;
}
```

**Example:**

```typescript
import { logger } from '@goatjs/storage/logger';

// Log to JSON file
await logger.toFile(JSON.stringify({ event: 'user_login' }), {
  extension: 'json',
  name: 'events',
});

// Log with unique filename
await logger.toFile('Debug info', {
  extension: 'txt',
  name: 'debug',
  unique: true,
});

// Delete logs
await logger.delete('events.json');
await logger.deleteAll();
```

## Storage Location

All storage is stored in:

- **Linux/macOS**: `~/.coraline/<scope>/<project-name>/`
- **Windows**: `%USERPROFILE%\.coraline\<scope>\<project-name>\`

The project name is derived from the root `package.json`.

## Dependencies

- `@goatjs/node` (peer dependency)
- `zod` (peer dependency)
