import path from 'node:path';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { prettier, prettierParsers, type PrettierParser } from '@goatjs/node/prettier';
import { storage } from './storage.ts';

interface FileOptions {
  extension?: PrettierParser | 'txt' | 'xml';
  name?: string;
  unique?: boolean;
}

export const logger = {
  toFile: async (data: string, { extension = 'json', name = 'log', unique }: FileOptions = {}) => {
    const fileNameNoExt = unique ? `${name}-${getHash()}` : name;
    const file = path.join(logPath, `${fileNameNoExt}.${extension}`);
    const parsedData = isPrettierFormat(extension) ? await prettier.format(data, { parser: extension }) : data;
    await fs.writeFile(file, parsedData);
    // eslint-disable-next-line no-console
    console.log(name, 'stored at:', file);
  },
  delete: (name: string) => fs.rm(path.join(logPath, name)),
  deleteAll: () => fs.rm(logPath, { recursive: true, force: true }),
};

const logPath = await storage.use('log');

const getHash = () => {
  return crypto.randomBytes(5).toString('hex');
};

const isPrettierFormat = (format: string): format is PrettierParser => {
  return prettierParsers.includes(format as PrettierParser);
};
