# @goatjs/ts-unused-exports

Find unused exports in TypeScript projects with support for package.json exports.

## Installation

```bash
npm install --save-dev @goatjs/ts-unused-exports
```

## Exports

### `findUnusedExports`

Finds all unused exports in the project.

**Signature:**

```typescript
export const findUnusedExports: (options?: UnusedOptions) => Promise<UnusedResponse | undefined>;
```

**Parameters:**

- `options` (UnusedOptions, optional): Configuration options

**Returns:** Promise<UnusedResponse | undefined> - Object with unused exports or undefined if none found

#### UnusedOptions Interface

```typescript
interface UnusedOptions {
  /** Path to tsconfig.json. Default: './tsconfig.json' */
  tsConfigPath?: string;
  /** Variable/export names to ignore */
  ignoreVars?: string[];
  /** Filenames to ignore */
  ignoreFiles?: string[];
  /** Folders to ignore */
  ignoreFolders?: string[];
}
```

#### UnusedResponse Type

```typescript
type UnusedResponse = Record<string, ExportNameAndLocation[]>;

interface ExportNameAndLocation {
  exportName: string;
  location: { line: number; character: number };
}
```

**Example:**

```typescript
import { findUnusedExports } from '@goatjs/ts-unused-exports';

// Find all unused exports
const unused = await findUnusedExports();

if (unused) {
  console.log('Unused exports found:');
  for (const [file, exports] of Object.entries(unused)) {
    console.log(`  ${file}:`);
    exports.forEach((exp) => {
      console.log(`    - ${exp.exportName} (line ${exp.location.line})`);
    });
  }
}
```

#### With Options

```typescript
const unused = await findUnusedExports({
  tsConfigPath: './tsconfig.build.json',
  ignoreVars: ['__dirname', '__filename'], // Ignore specific exports
  ignoreFiles: ['types.ts'], // Ignore specific files
  ignoreFolders: ['src/generated'], // Ignore folders
});
```

## Features

### Package.json Export Awareness

Files listed in `package.json` exports are automatically excluded from unused checks:

```json
{
  "exports": {
    ".": "./dist/index.js",
    "./utils": "./dist/utils.js"
  }
}
```

### Vanilla Extract Support

CSS files created with Vanilla Extract (`.css.ts`) are automatically detected and excluded if they are imported as `.css` files.

### Validation

The tool validates your ignore lists and throws if entries are no longer needed:

```typescript
// This will throw if 'oldVar' is actually used
await findUnusedExports({
  ignoreVars: ['oldVar'],
});
```

## CLI Usage

While primarily a library, you can create a script:

```typescript
// scripts/check-exports.ts
import { findUnusedExports } from '@goatjs/ts-unused-exports';

const run = async () => {
  const unused = await findUnusedExports();

  if (unused) {
    console.error('Unused exports found!');
    console.error(unused);
    process.exit(1);
  }

  console.log('No unused exports found.');
};

run();
```

```json
{
  "scripts": {
    "check-exports": "tsx scripts/check-exports.ts"
  }
}
```

## Integration with CI

```yaml
# .github/workflows/ci.yml
name: Check Unused Exports

on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run check-exports
```

## Dependencies

- `@goatjs/node`
- `ts-unused-exports` (underlying analysis engine)
