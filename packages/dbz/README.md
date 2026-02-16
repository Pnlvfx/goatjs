# @goatjs/dbz

CLI tool and library for publishing packages to npm with monorepo support.

## Installation

```bash
npm install --save-dev @goatjs/dbz
```

## CLI Usage

### Publish

```bash
npx dbz publish [version]
```

Options:

- `version`: Version bump type (`major`, `minor`, `patch`) or specific version
- `--skip-git`: Skip git checks and commits
- `--skip-clear`: Skip clearing build artifacts after publish

```bash
# Publish with minor version bump (default)
npx dbz publish

# Publish with specific version type
npx dbz publish minor
npx dbz publish major
npx dbz publish patch

# Skip git checks
npx dbz publish --skip-git

# Skip cleanup after publish
npx dbz publish --skip-clear
```

### Unpublish

```bash
npx dbz unpublish <package-name>
```

```bash
npx dbz unpublish @myorg/package-name
```

### Clear

Clears build artifacts from all packages.

```bash
npx dbz clear
```

## Programmatic API

All modules are exported via wildcard (`"./*": "./src/*.ts"`), so you can import any file directly.

### Main DBZ (`@goatjs/dbz/dbz`)

#### `dbz`

Main dbz object with publish and unpublish methods.

```typescript
import { dbz } from '@goatjs/dbz/dbz';

// Publish
await dbz.publish({
  version: 'minor',
  skipClear: false,
  skipGit: false,
});

// Unpublish a package
await dbz.unpublish('@myorg/package-name');

// Clear build artifacts
await dbz.clear({ extra: ['.cache'] });
```

### Spawn Utilities (`@goatjs/dbz/spawn`)

#### `spawnWithLog`

Spawns a process with logging support.

```typescript
import { spawnWithLog } from '@goatjs/dbz/spawn';
const { stdout, stderr } = await spawnWithLog('yarn', ['install']);
```

### Yarn Utilities (`@goatjs/dbz/yarn`)

#### `yarn`

Yarn workspace and configuration utilities.

```typescript
import { yarn } from '@goatjs/dbz/yarn';

const isMonorepo = await yarn.isMonorepo();
await yarn.workspace.runAll(['run', 'build']);
const workspaces = await yarn.workspace.list();
const registry = await yarn.config.get('npmRegistryServer');
```

### Git Utilities (`@goatjs/dbz/git`)

#### `checkGitStatus`

Checks git status and prompts user for actions.

```typescript
import { checkGitStatus } from '@goatjs/dbz/git';
await checkGitStatus();
await checkGitStatus({ cwd: './packages/core' });
```

### TypeScript Config (`@goatjs/dbz/typescript/read`)

#### `getProjectTsConfig`

Reads and parses the project's TypeScript configuration.

```typescript
import { getProjectTsConfig } from '@goatjs/dbz/typescript/read';
const config = getProjectTsConfig();
```

### Publishing (`@goatjs/dbz/publish`)

#### `publish`, `isValidYarnVersion`

```typescript
import { publish, isValidYarnVersion } from '@goatjs/dbz/publish';
await publish({ version: 'minor', monorepo: true });
const isValid = isValidYarnVersion('minor');
```
