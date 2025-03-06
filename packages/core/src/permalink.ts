/** Create a url from the given text. */
export const createPermalink = (text: string, { separator = '_', maxLength = 50 } = {}) => {
  const perma = text.trim().replaceAll(' ', separator).replaceAll(/\W/g, '').toLowerCase().slice(0, maxLength).trimEnd();
  if (perma.endsWith(separator)) {
    // eslint-disable-next-line sonarjs/no-ignored-return
    perma.slice(-1);
  }
  return perma;
};
