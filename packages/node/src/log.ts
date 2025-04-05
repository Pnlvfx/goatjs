/* eslint-disable no-console */
import { inspect } from 'node:util';
import { temporaryFile } from './tempy.js';
import fs from 'node:fs/promises';

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
