/* eslint-disable sonarjs/no-commented-code */
import nativeSanitize from 'sanitize-filename';

// TODO [2026-12-30] use this and remove sanitize-filename (note that actually it doesn't work!)

// const illegalRe = /["*/:<>?\\|]/g;
// const controlRe = /[\u0000-\u001F\u0080-\u009F]/g;
// const reservedRe = /^\.+$/;
// const windowsReservedRe = /^(con|prn|aux|nul|com\d|lpt\d)(\..*)?$/i;
// const windowsTrailingRe = /[ .]+$/;

// const sanitizeString = (input: string, replacement: string) => {
//   const sanitized = input
//     .replace(illegalRe, replacement)
//     .replace(controlRe, replacement)
//     .replace(reservedRe, replacement)
//     .replace(windowsReservedRe, replacement)
//     .replace(windowsTrailingRe, replacement);
//   return truncate(sanitized, 255);
// };

export const sanitize = (input: string, { replacement = '' }: { replacement?: string } = {}) => {
  return nativeSanitize(input, { replacement });
  // const output = sanitizeString(input, replacement);
  // return replacement === '' ? output : sanitizeString(output, '');
};
