import type { ExecOptions } from 'node:child_process';

export interface GitStatusParams extends ExecOptions {
  porcelain?: boolean;
}
