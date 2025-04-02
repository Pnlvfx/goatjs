/* eslint-disable no-console */
import { inspect } from 'node:util';
import { temporaryFile } from './tempy.js';
import fs from 'node:fs/promises';

/** @deprecated use storage.logToFile, this is just for temporary usage. */
export const logToFile = async (data: string, { extension = 'json', title = 'Log stored at:' } = {}) => {
  const file = await temporaryFile({ extension });
  await fs.writeFile(file, data);
  console.log(title, file);
};

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
