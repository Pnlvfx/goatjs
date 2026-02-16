# @goatjs/link-preview

Extract metadata from URLs for creating link previews.

## Installation

```bash
npm install @goatjs/link-preview
```

## Exports

### `getLinkPreview`

Extracts metadata (title, description, image, site name) from a URL.

**Signature:**

```typescript
export const getLinkPreview: (url: string) => Promise<{
  title: string | undefined;
  description: string | undefined;
  image: string | undefined;
  siteName: string;
  hostname: string;
}>;
```

**Parameters:**

- `url` (string): The URL to extract metadata from

**Returns:** Promise with link preview data

**Example:**

```typescript
import { getLinkPreview } from '@goatjs/link-preview';

const preview = await getLinkPreview('https://github.com');
console.log(preview);
// {
//   title: 'GitHub: Let's build from here',
//   description: 'GitHub is where people build software...',
//   image: 'https://github.com/og-image.png',
//   siteName: 'GitHub',
//   hostname: 'github.com'
// }
```

## Metadata Sources

The function extracts metadata from:

- **OpenGraph tags** (`og:title`, `og:description`, `og:image`, `og:site_name`)
- **Standard meta tags** (`meta description`, `title`)
- **Page images** (first image if no OpenGraph image)

## Dependencies

- `html-metadata-parser`

## Use Cases

- Social media link previews
- Bookmark managers
- Content aggregation
- Rich text editors
- URL unfurling
