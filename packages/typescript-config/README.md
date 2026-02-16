# @goatjs/typescript-config

Shared TypeScript configuration files for GoatJS projects.

## Installation

```bash
npm install --save-dev @goatjs/typescript-config
```

## Available Configurations

### Base Configuration

For general TypeScript projects:

```json
{
  "extends": "@goatjs/typescript-config/base"
}
```

### Node Server

For Node.js server applications:

```json
{
  "extends": "@goatjs/typescript-config/node-server"
}
```

### Node Library

For Node.js libraries:

```json
{
  "extends": "@goatjs/typescript-config/node-library"
}
```

### React Library

For React component libraries:

```json
{
  "extends": "@goatjs/typescript-config/react-library"
}
```

### Next.js

For Next.js applications:

```json
{
  "extends": "@goatjs/typescript-config/nextjs"
}
```

## Usage Example

Create a `tsconfig.json` in your project root:

```json
{
  "extends": "@goatjs/typescript-config/node-library",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Configuration Details

### Base

- Strict TypeScript checking enabled
- ES2022 target
- Modern module resolution

### Node Server

- Extends base configuration
- Optimized for server-side Node.js applications
- Includes Node.js type definitions

### Node Library

- Extends base configuration
- Optimized for publishing npm packages
- Declaration file generation enabled
- Composite project settings for monorepos

### React Library

- Extends node-library configuration
- JSX support enabled
- React type definitions
- Optimized for component libraries

### Next.js

- Extends base configuration
- Next.js specific settings
- App Router support
- Image optimization types

## Overriding Configurations

You can override any settings from the extended configuration:

```json
{
  "extends": "@goatjs/typescript-config/base",
  "compilerOptions": {
    "strict": false,
    "target": "ES2020"
  }
}
```

## Peer Dependencies

- `typescript` (required)
