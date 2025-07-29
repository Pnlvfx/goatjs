import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { prettier, type PrettierParsingOption } from '@goatjs/node/prettier';
import { cwd } from '../config.js';
import { mkDir } from '../helpers.js';

const logPath = path.join(cwd, 'log');
await mkDir(logPath);

interface FileOptions {
  extension?: PrettierParsingOption | 'txt';
  name?: string;
  unique?: boolean;
}

const getHash = () => {
  return crypto.randomBytes(5).toString('hex');
};

export const logger = {
  toFile: async (data: string, { extension = 'json', name = 'log', unique }: FileOptions = {}) => {
    const fileNameNoExt = unique ? `${name}-${getHash()}` : name;
    const file = path.join(logPath, `${fileNameNoExt}.${extension}`);
    const parsedData = extension === 'txt' ? data : await prettier.format(data, { parser: extension });
    await fs.writeFile(file, parsedData);
    // eslint-disable-next-line no-console
    console.log(name, 'stored at:', file);
  },
  delete: (name: string) => fs.rm(path.join(logPath, name)),
  deleteAll: () => fs.rm(logPath, { recursive: true, force: true }),
};
