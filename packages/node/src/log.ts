import { inspect } from 'node:util';
import { temporaryFile } from './tempy.js';
import fs from 'node:fs/promises';

/** @deprecated use storage.logToFile, this is just for temporary usage. */
export const logToFile = async (data: string, { extension = 'json', title = 'Log stored at:' } = {}) => {
  const file = await temporaryFile({ extension });
  await fs.writeFile(file, data);
  // eslint-disable-next-line no-console
  console.log(title, file);
};

export const log = (message?: unknown, ...opts: unknown[]) => {
  // eslint-disable-next-line no-console
  console.log(inspectLog(message), opts.map((t) => inspectLog(t)).join(' '));
};

// eslint-disable-next-line sonarjs/function-return-type
const inspectLog = (message: unknown) => {
  if (typeof message === 'string' || typeof message === 'number') return message;
  return inspect(message, {
    maxArrayLength: Infinity,
    depth: Infinity,
    colors: true,
  });
};
