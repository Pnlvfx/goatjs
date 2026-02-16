# @goatjs/zod-error

Enhanced Zod error handling with custom error messages and global configuration.

## Installation

```bash
npm install @goatjs/zod-error
```

## Exports

### Error Handling (`@goatjs/zod-error/error`)

#### `validationError`

Creates a ValidationError with attached data.

**Signature:**

```typescript
export const validationError: (message: string, { data }: { data: unknown }) => ValidationError;
```

**Example:**

```typescript
import { validationError } from '@goatjs/zod-error/error';

const err = validationError('Invalid user data', {
  data: { name: 'Jo' },
});
```

#### `isValidationError`

Type guard to check if an error is a ValidationError.

**Signature:**

```typescript
export const isValidationError: (err: unknown) => boolean;
```

**Example:**

```typescript
import { isValidationError } from '@goatjs/zod-error/error';

try {
  // some code
} catch (err) {
  if (isValidationError(err)) {
    console.log(err.data); // Access attached data
  }
}
```

### Parsing (`@goatjs/zod-error/parse`)

#### `parseAsync`

Async Zod parsing with enhanced error messages.

**Signature:**

```typescript
export const parseAsync: <T extends z.$ZodType>(schema: T, value: unknown, ctx?: z.ParseContext) => Promise<z.output<T>>;
```

**Example:**

```typescript
import { parseAsync } from '@goatjs/zod-error/parse';
import * as z from 'zod';

const userSchema = z.object({
  name: z.string(),
  age: z.number(),
});

// Parse with enhanced error
const user = await parseAsync(userSchema, {
  name: 'John',
  age: 30,
});

// On error, throws ValidationError with the input data attached
try {
  await parseAsync(userSchema, { name: 123 });
} catch (err) {
  // Error message includes the invalid value
}
```

### Global Configuration (`@goatjs/zod-error/globals`)

#### `configureGlobalZodError`

Configures global custom error messages for Zod.

**Signature:**

```typescript
export const configureGlobalZodError: () => void;
```

**Example:**

```typescript
import { configureGlobalZodError } from '@goatjs/zod-error/globals';
import * as z from 'zod';

// Configure once at app startup
configureGlobalZodError();

// Now all Zod errors use custom messages
const schema = z.string();
schema.parse(123);
// Error: "Invalid type: expected string, received 123"
```

## Custom Error Messages

When you call `configureGlobalZodError()`, the following custom error messages are applied:

- **Invalid value**: `"Invalid value: expected <values>, received <input>"`
- **Invalid type**: `"Invalid type: expected <type>, received <input>"`
- **Invalid format**: `"Invalid format: expected <format>, received <input>"`
- **Unrecognized keys**: `"Unrecognized keys: key1: <value1>, key2: <value2>"`

## Usage Patterns

### Basic Validation

```typescript
import { parseAsync } from '@goatjs/zod-error/parse';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const data = await parseAsync(schema, req.body);
```

### With Custom Configuration

```typescript
import { configureGlobalZodError } from '@goatjs/zod-error/globals';
import { parseAsync } from '@goatjs/zod-error/parse';

// Setup
configureGlobalZodError();

// All subsequent validations use custom messages
```

### Error Handling

```typescript
import { isValidationError } from '@goatjs/zod-error/error';
import { parseAsync } from '@goatjs/zod-error/parse';

app.post('/api/users', async (req, res) => {
  try {
    const user = await parseAsync(userSchema, req.body);
    res.json(user);
  } catch (err) {
    if (isValidationError(err)) {
      res.status(400).json({
        error: err.message,
        details: err.data, // Original input data
      });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});
```

## Dependencies

- `zod` (peer dependency)
