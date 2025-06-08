import { noCase } from './internal.js';
import type { CaseOptions } from './options.js';

/**
 * Convert a string to path case (`foo/bar`).
 */
export function pathCase(input: string, options?: CaseOptions) {
  return noCase(input, { delimiter: '/', ...options });
}
