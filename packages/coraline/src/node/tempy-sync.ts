import type { TempDirParams } from './tempy.js';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import crypto from 'node:crypto';

const tempDir = fs.realpathSync(os.tmpdir());
const getPath = (prefix = '') => path.join(tempDir, prefix + crypto.randomBytes(5).toString('hex'));

export const temporaryFileSync = ({ name, extension }: TempDirParams) => {
  if (name) {
    return path.join(temporaryDirectorySync(), name);
  }
  return getPath() + (extension === undefined ? '' : '.' + extension.replace(/^\./, ''));
};

export const temporaryDirectorySync = ({ prefix = '' } = {}) => {
  const directory = getPath(prefix);
  fs.mkdirSync(directory);
  return directory;
};
