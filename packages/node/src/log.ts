/* eslint-disable no-console */
import { inspect } from 'node:util';

export const inspectLog = (message: unknown) => {
  if (typeof message === 'string' || typeof message === 'number') {
    console.log(message);
    return;
  }
  console.log(
    inspect(message, {
      maxArrayLength: Infinity,
      depth: Infinity,
      colors: true,
    }),
  );
};
