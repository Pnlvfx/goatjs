import { noCase } from './internal.ts';
import type { CaseOptions } from './options.ts';

/**
 * Convert a string to path case (`foo/bar`).
 */
export function pathCase(input: string, options?: CaseOptions) {
  return noCase(input, { delimiter: '/', ...options });
}
