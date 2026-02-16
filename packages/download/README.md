# @goatjs/download

A utility for downloading files from URLs with automatic filename detection.

## Installation

```bash
npm install @goatjs/download
```

## Exports

### `download`

Downloads a file from a URL to the specified directory.

**Signature:**

```typescript
export const download: (url: string, options?: DownloadOptions) => Promise<string>;
```

**Parameters:**

- `url` (string): The URL to download from
- `options` (DownloadOptions, optional): Download configuration

**Returns:** Promise<string> - The full path to the downloaded file

#### DownloadOptions Interface

```typescript
interface DownloadOptions {
  /** The directory in which the file will be stored. Defaults to system Downloads folder. */
  directory?: string;
  /** Custom headers for the request */
  headers?: HeadersInit;
  /** Allow overriding existing files. Default: true */
  override?: boolean;
}
```

**Example:**

```typescript
import { download } from '@goatjs/download';

// Basic download
const filePath = await download('https://example.com/file.pdf');
console.log(`Downloaded to: ${filePath}`);

// Download with custom options
const filePath = await download('https://example.com/image.png', {
  directory: '/path/to/save',
  headers: {
    Authorization: 'Bearer token123',
  },
  override: false,
});
```

### Filename Detection

The downloaded file is saved with a filename determined by (in order of priority):

1. `Content-Disposition` header filename
2. URL path basename
3. `Content-Type` header extension

**Error Cases:**

- Throws if URL is invalid or unreachable
- Throws if `override` is false and file already exists
- Throws if unable to determine filename

## Dependencies

- `@goatjs/node` (peer dependency)
- `mime-types`
