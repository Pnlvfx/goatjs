import type { UnusedResponse } from './types.js';

// this is just skipping the files and it's not a real solution.
export const patchSkipVanillaCssFiles = (unused: UnusedResponse) => {
  const tempSkip: UnusedResponse = {};
  for (const [key, value] of Object.entries(unused)) {
    if (key.includes('.css')) {
      // eslint-disable-next-line no-console
      console.warn(`Css "${key}" has been skipped duo to a bug.`);
    } else {
      tempSkip[key] = value;
    }
  }

  return tempSkip;
};
