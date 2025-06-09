import type { UnusedResponse } from './ts-unused-exports.js';

// TODO this is just skipping the files and it's not a real solution.
export const patchSkipVanillaCssFiles = (unused: UnusedResponse) => {
  const tempSkip: UnusedResponse = {};
  for (const [key, value] of Object.entries(unused)) {
    if (key.includes('.css')) {
      console.warn(`vanilla extract css "${key}" has been skipped duo to a bug`);
    } else {
      tempSkip[key] = value;
    }
  }

  return tempSkip;
};
