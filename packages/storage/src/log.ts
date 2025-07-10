import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { mkDir } from './helpers.js';
import { cwd } from './config.js';

const logPath = path.join(cwd, 'log');
await mkDir(logPath);

export const log = {
  toFile: async (data: string, { extension = 'json', name = 'Log' } = {}) => {
    const file = path.join(logPath, `${crypto.randomBytes(5).toString('hex')}.${extension}`);
    await fs.writeFile(file, data);
    // eslint-disable-next-line no-console
    console.log(name, 'stored at:', file);
  },
  delete: (name: string) => fs.rm(path.join(logPath, name)),
  deleteAll: () => fs.rm(logPath, { recursive: true, force: true }),
};
