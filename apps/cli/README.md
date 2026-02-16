# @goatjs/cli

Development CLI for testing and experimenting with GoatJS packages.

## Installation

```bash
npm install -g @goatjs/cli
```

Or use directly with npx:

```bash
npx @goatjs/cli
```

## Usage

The CLI provides an interactive menu for testing various GoatJS utilities:

```bash
npx goatjs
```

This will start an interactive CLI where you can:

1. **Test storage** - Create and test storage directories
2. **Test object transformations** - Camelize object keys
3. **Test caching** - Create and query cache keys
4. **Test dbz unpublish** - Unpublish npm packages
5. **Test TypeScript config** - Read project tsconfig
6. **Test domain extraction** - Extract domains from URLs

## Development

This package is primarily for internal development and testing of GoatJS packages.

### Running Locally

```bash
cd apps/cli
yarn start
```

## Available Commands

Once running, you'll see a prompt. Enter a number to run different tests:

- `1` - Test storage directory creation
- `2` - Test object key transformation (camelCase)
- `3` - Test caching functionality
- `4` - Test package unpublishing
- `5` - Test TypeScript config reading
- `6` - Test domain extraction from URLs

## Notes

- This CLI is primarily for development purposes
- Commands may modify files or make network requests
- Use with caution in production environments
