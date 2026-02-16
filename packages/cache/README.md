# @goatjs/cache

A caching utility for JavaScript and TypeScript with support for in-memory and persistent storage.

## Installation

```bash
npm install @goatjs/cache
```

## Exports

### `createCacheKey`

Creates a cache key with configurable options for caching function results.

**Signature:**

```typescript
export const createCacheKey: <T, P extends unknown[]>(
  name: string,
  options: CacheOptions<T, P>,
) => { query: (...params: P) => Promise<T>; invalidate: () => Promise<void> };
```

**Parameters:**

- `name` (string): A unique name for the cache key
- `options` (CacheOptions<T, P>): Configuration options

**Returns:** An object with `query` and `invalidate` methods

#### CacheOptions Interface

```typescript
interface CacheOptions<T, P extends unknown[]> {
  /** Time in milliseconds after which cache expires */
  expiresIn?: number;
  /** Whether to persist cache to disk */
  persist?: boolean;
  /** Data type: 'json', 'xml', or 'html' */
  type: 'json' | 'xml' | 'html';
  /** The function to cache */
  fn: (...args: P) => Promise<T> | T;
  /** Enable debug logging */
  debug?: boolean;
}
```

**Example:**

```typescript
import { createCacheKey } from '@goatjs/cache';

// Create a cached function
const userCache = createCacheKey('users', {
  type: 'json',
  fn: async (userId: string) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  },
  persist: true,
  expiresIn: 1000 * 60 * 5, // 5 minutes
  debug: true,
});

// Use the cache - returns cached data or fetches if stale/missing
const user = await userCache.query('123');

// Invalidate the cache
await userCache.invalidate();
```

## Types

### `CacheData<T>`

Type representing cached data structure.

```typescript
interface CacheData<T> {
  timestamp: number;
  data: T;
  persist?: boolean;
  cacheKey: string;
}
```

### `CacheStore`

Zod schema type for cache store metadata.

```typescript
type CacheStore = {
  id: string;
  cacheKey: string;
  timestamp: number;
  type: 'json' | 'xml' | 'html';
};
```

## Dependencies

- `@goatjs/core`
- `@goatjs/storage`
- `zod` (peer dependency)
