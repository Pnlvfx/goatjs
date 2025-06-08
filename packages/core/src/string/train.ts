import type { CaseOptions } from './options.js';
import { capitalCase } from './capitalize.js';

/**
 * Convert a string to header case (`Foo-Bar`).
 */
export function trainCase(input: string, options?: CaseOptions) {
  return capitalCase(input, { delimiter: '-', ...options });
}
