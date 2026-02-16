# @goatjs/puppeteer-mouse

Visual mouse helper for Puppeteer that displays a visible cursor during automation.

## Installation

```bash
npm install @goatjs/puppeteer-mouse
```

## Requirements

- `puppeteer-core` as a peer dependency

## Exports

### `installMouseHelper`

Injects a visual mouse cursor into the page that follows mouse movements.

**Signature:**

```typescript
export const installMouseHelper: (page: Page) => Promise<void>;
```

**Parameters:**

- `page` (Page): A Puppeteer Page instance

**Returns:** Promise<void>

**Example:**

```typescript
import puppeteer from 'puppeteer-core';
import { installMouseHelper } from '@goatjs/puppeteer-mouse';

const browser = await puppeteer.launch();
const page = await browser.newPage();

// Install the mouse helper
await installMouseHelper(page);

// Now when you move the mouse, you'll see a visual cursor
await page.goto('https://example.com');
await page.mouse.move(100, 100);
await page.mouse.click(200, 200);
```

## Visual Features

The mouse helper displays:

- A semi-transparent circular cursor (20x20px)
- **Default state**: Dark gray background with white border
- **Left click**: Darker background
- **Right click**: Blue border
- **Middle click**: Square cursor with rounded corners
- **Mouse 4**: Red border
- **Mouse 5**: Green border

## Use Cases

- Recording automation demos
- Debugging mouse interactions
- Creating tutorials
- Visual testing verification
- Presentations showing browser automation

## How It Works

The helper injects:

1. A custom `<puppeteer-mouse-pointer>` element into the page
2. CSS styles for the cursor appearance
3. Event listeners for mouse movement and button states

The element follows the mouse position and changes appearance based on mouse button states.

## Notes

- Only works on the top-level frame (not in iframes)
- The cursor is purely visual and doesn't affect automation
- CSS is injected via `evaluateOnNewDocument`
