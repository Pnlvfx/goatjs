/* eslint-disable unicorn/prefer-string-replace-all */
/* eslint-disable sonarjs/no-control-regex */
/* eslint-disable no-control-regex */
/* eslint-disable sonarjs/slow-regex */
import { truncate } from './truncate-utf8-bytes.js';

// TODO use this and remove sanitize-filename (note that actually it doesn't work!)

const illegalRe = /["*/:<>?\\|]/g;
const controlRe = /[\u0000-\u001F\u0080-\u009F]/g;
const reservedRe = /^\.+$/;
const windowsReservedRe = /^(con|prn|aux|nul|com\d|lpt\d)(\..*)?$/i;
const windowsTrailingRe = /[ .]+$/;

const sanitizeString = (input: string, replacement: string) => {
  const sanitized = input
    .replace(illegalRe, replacement)
    .replace(controlRe, replacement)
    .replace(reservedRe, replacement)
    .replace(windowsReservedRe, replacement)
    .replace(windowsTrailingRe, replacement);
  return truncate(sanitized, 255);
};

export const sanitize = (input: string, { replacement = '' }: { replacement?: string } = {}) => {
  const output = sanitizeString(input, replacement);
  return replacement === '' ? output : sanitizeString(output, '');
};
