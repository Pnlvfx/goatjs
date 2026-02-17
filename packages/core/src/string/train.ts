import type { CaseOptions } from './options.ts';
import { capitalCase } from './capitalize.ts';

/**
 * Convert a string to header case (`Foo-Bar`).
 */
export function trainCase(input: string, options?: CaseOptions) {
  return capitalCase(input, { delimiter: '-', ...options });
}
