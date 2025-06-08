import { noCase } from './internal.js';
import type { CaseOptions } from './options.js';

/**
 * Convert a string to dot case (`foo.bar`).
 */
export function dotCase(input: string, options?: CaseOptions) {
  return noCase(input, { delimiter: '.', ...options });
}
