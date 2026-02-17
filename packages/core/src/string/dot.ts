import { noCase } from './internal.ts';
import type { CaseOptions } from './options.ts';

/**
 * Convert a string to dot case (`foo.bar`).
 */
export function dotCase(input: string, options?: CaseOptions) {
  return noCase(input, { delimiter: '.', ...options });
}
