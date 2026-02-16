# @goatjs/pslist

Get a list of running processes on the system.

## Installation

```bash
npm install @goatjs/pslist
```

## Exports

### `psList`

Retrieves a list of running processes.

**Signature:**

```typescript
export const psList: (options?: { all?: boolean }) => Promise<ProcessDescriptor[]>;
```

**Parameters:**

- `options` (object, optional):
  - `all` (boolean): Include all processes (not just user processes). Default: true

**Returns:** Promise<ProcessDescriptor[]>

#### ProcessDescriptor Interface

```typescript
interface ProcessDescriptor {
  readonly pid: number; // Process ID
  readonly name: string; // Process name
  readonly ppid: number; // Parent process ID
  readonly cmd?: string; // Command line (not on Windows)
  readonly cpu?: number; // CPU usage % (not on Windows)
  readonly memory?: number; // Memory usage % (not on Windows)
  readonly uid?: number; // User ID (not on Windows)
}
```

**Example:**

```typescript
import { psList } from '@goatjs/pslist';

// Get all processes
const processes = await psList();
console.log(processes);
// [
//   { pid: 1, name: 'systemd', ppid: 0, cmd: '/sbin/init', cpu: 0.1, memory: 0.5, uid: 0 },
//   { pid: 1234, name: 'node', ppid: 567, cmd: 'node server.js', cpu: 5.2, memory: 2.1, uid: 1000 }
// ]

// Get only user processes (not all system processes)
const userProcesses = await psList({ all: false });

// Find a specific process
const nodeProcesses = processes.filter((p) => p.name.includes('node'));
```

### `execFileAsync`

Promisified version of Node's `execFile`.

**Signature:**

```typescript
export const execFileAsync: (file: string, args?: string[], options?: ExecFileOptions) => Promise<{ stdout: string; stderr: string }>;
```

**Example:**

```typescript
import { execFileAsync } from '@goatjs/pslist';

const { stdout } = await execFileAsync('ls', ['-la']);
console.log(stdout);
```

## Platform Support

### Windows

- Uses native `fastlist` executable for efficient process listing
- Supports x64 and x86 architectures
- Returns: `pid`, `ppid`, `name` only

### macOS & Linux

- Uses native `ps` command
- Returns full process information: `pid`, `name`, `ppid`, `cmd`, `cpu`, `memory`, `uid`

## Notes

- Some fields are not available on Windows due to OS limitations
- CPU and memory usage percentages are system-dependent
- The function automatically detects the platform and uses the appropriate method
