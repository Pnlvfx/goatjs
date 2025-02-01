import { inspect } from 'node:util';
import { isProduction } from './shared.js';
import { temporaryFile } from './tempy.js';
import fs from 'node:fs/promises';

export const logToFile = async (data: unknown, { extension = 'json' } = {}) => {
  if (isProduction) throw new Error('Do not use coraline.log in production as it is used only for debugging purposes.');
  const file = await temporaryFile({ extension });
  await fs.writeFile(file, JSON.stringify(data));
  // eslint-disable-next-line no-console
  console.log('Log stored at:', file);
};

export const log = (message?: unknown, ...opts: unknown[]) => {
  if (isProduction) throw new Error('Do not use coraline.log in production as it is used only for debugging purposes.');
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
