# @goatjs/core

Core utility functions for JavaScript and TypeScript projects.

## Installation

```bash
npm install @goatjs/core
```

## Exports

All modules are exported via wildcard (`"./*": "./src/*.ts"`), so you can import any file directly.

### Error Handling (`@goatjs/core/error`)

#### `parseError`

Parses unknown errors into proper Error objects.

```typescript
import { parseError } from '@goatjs/core/error';
const error = parseError(err);
```

### Safe Wrappers (`@goatjs/core/safe-wrap`)

#### `makeErrorWrapper`

Wraps a function to handle errors gracefully (sync).

```typescript
import { makeErrorWrapper } from '@goatjs/core/safe-wrap';
const safeParse = makeErrorWrapper(() => null)(JSON.parse);
```

#### `makeAsyncErrorWrapper`

Wraps an async function to handle errors gracefully.

```typescript
import { makeAsyncErrorWrapper } from '@goatjs/core/safe-wrap';
const safeFetch = makeAsyncErrorWrapper(() => null)(fetch);
```

### Retry Logic (`@goatjs/core/retry`)

#### `withRetry`

Retries a function on failure with configurable options.

```typescript
import { withRetry } from '@goatjs/core/retry';
const fetchWithRetry = withRetry(fetch, { maxAttempts: 3, retryIntervalMs: 1000 });
```

### Timing (`@goatjs/core/wait`, `@goatjs/core/throttle`, `@goatjs/core/debounce`)

#### `wait`

Returns a promise that resolves after specified milliseconds.

```typescript
import { wait } from '@goatjs/core/wait';
await wait(1000);
```

#### `throttle`

Limits function execution to once per specified time period.

```typescript
import { throttle } from '@goatjs/core/throttle';
const throttled = throttle(handleScroll, 100);
```

#### `debounce`

Delays function execution until after a pause in calls.

```typescript
import { debounce } from '@goatjs/core/debounce';
const debounced = debounce(handleSearch, 300);
```

### Array Utilities (`@goatjs/core/array`)

```typescript
import { arrayMove, getUniqueArrayByKey, shuffleArray, getDuplicates, indexOf, lastIndexOf } from '@goatjs/core/array';

arrayMove(arr, 0, 2); // Move element from index 0 to 2
getUniqueArrayByKey(users, 'id'); // Remove duplicates by key
shuffleArray(arr); // Shuffle array in place
getDuplicates(arr); // Get duplicate elements
indexOf(arr, 'item'); // Find index or throw
```

### String Utilities (`@goatjs/core/string/*`)

#### Case Conversions

```typescript
import { camelCase } from '@goatjs/core/string/camel';
import { kebabCase } from '@goatjs/core/string/kebab';
import { snakeCase } from '@goatjs/core/string/snake';
import { pascalCase, pascalSnakeCase } from '@goatjs/core/string/pascal';
import { constantCase } from '@goatjs/core/string/constant';
import { capitalCase } from '@goatjs/core/string/capitalize';
import { sentenceCase } from '@goatjs/core/string/sentence';
import { trainCase } from '@goatjs/core/string/train';
import { dotCase } from '@goatjs/core/string/dot';
import { pathCase } from '@goatjs/core/string/path';
import { toUpperCase } from '@goatjs/core/string/uppercase';

camelCase('hello-world'); // 'helloWorld'
kebabCase('helloWorld'); // 'hello-world'
snakeCase('helloWorld'); // 'hello_world'
pascalCase('hello-world'); // 'HelloWorld'
```

#### Other String Functions

```typescript
import { capitalize } from '@goatjs/core/capitalize';
import { createPermalink } from '@goatjs/core/permalink';
import { indexOf, lastIndexOf } from '@goatjs/core/string';

capitalize('hello'); // 'Hello'
createPermalink('Hello World!'); // 'hello_world'
```

### Object Utilities (`@goatjs/core/object`, `@goatjs/core/object/*`)

```typescript
import { getEntries, getKeys, getValues, omit } from '@goatjs/core/object';
import { camelizeObject } from '@goatjs/core/object/camel';
import { snakelizeObject } from '@goatjs/core/object/snake';
import { kebabizeObject } from '@goatjs/core/object/kebab';

getEntries(obj); // Typed Object.entries
getKeys(obj); // Typed Object.keys
getValues(obj); // Typed Object.values
omit(obj, ['password']); // Create object without keys
camelizeObject({ 'first-name': 'John' }); // { firstName: 'John' }
```

### Number Utilities (`@goatjs/core/number`)

```typescript
import { toNumber, isNumber, numberToString } from '@goatjs/core/number';

toNumber('42'); // 42
isNumber('42'); // true
numberToString(42); // '42'
```

### Date Utilities (`@goatjs/core/date/*`)

```typescript
import { createDate } from '@goatjs/core/date/date';
import { startOfDay } from '@goatjs/core/date/start';
import { endOfDay } from '@goatjs/core/date/end';
import { MONTHS } from '@goatjs/core/date/months';

const date = createDate('2024-01-15');
date.yymmdd(); // '2024-01-15'
startOfDay(new Date()); // Sets time to 00:00:00
endOfDay(new Date()); // Sets time to 23:59:59
MONTHS[0]; // 'January'
```

### Cookie Utilities (`@goatjs/core/cookies`, `@goatjs/core/cookie-parser`)

```typescript
import { getDomainFromUrl } from '@goatjs/core/cookies';
import { parseSetCookieHeader } from '@goatjs/core/cookie-parser';

await getDomainFromUrl('https://example.com/path');
const cookies = parseSetCookieHeader(response);
```

### Color Utilities (`@goatjs/core/color/*`)

```typescript
import { generateHSLColor, rgbToHsl, parseHslPixel } from '@goatjs/core/color/hsl';
import { generateOKLCHColor, parseOKLCHPixel } from '@goatjs/core/color/oklch';

generateHSLColor({ h: 200, s: 50, l: 50 }); // [200, '50%', '50%']
parseHslPixel(200, '50%', '50%'); // 'hsl(200,50%,50%)'
```

### URL Utilities (`@goatjs/core/ease`)

```typescript
import { isUrl, isJsonResponse } from '@goatjs/core/ease';

isUrl('https://example.com'); // true
isJsonResponse(response); // Check if response is JSON
```

### Types (`@goatjs/core/types/*`)

```typescript
import type { Callback } from '@goatjs/core/types/callback';
import type { OneOf } from '@goatjs/core/types/one-of';
import type { FlatObjectKeys } from '@goatjs/core/types/object';
```
