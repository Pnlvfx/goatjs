import * as z from 'zod';

// warn: zod is not listed as peer, i don't wanna force it but i need it here

const endings = new Set(['/', ':', '?', '#']);
const starters = new Set(['.', '/', '@']);

const ipSchema = z.union([z.ipv4(), z.ipv6()]);

// eslint-disable-next-line sonarjs/cognitive-complexity
export const getDomainFromUrl = async (url: string) => {
  if (url.includes('localhost')) return 'localhost';
  const { hostname } = new URL(url);
  const { success } = await z.safeParseAsync(ipSchema, hostname);
  if (success) return;
  let domainInc = 0;
  let offsetDomain = 0;
  let offsetStartSlice = 0;
  let offsetPath = 0;
  let len = url.length;
  let i = 0;

  // Find end offset of domain
  while (len-- !== 0 && ++i !== 0) {
    const u = url[i];
    if (domainInc !== 0 && u && endings.has(u)) {
      break;
    }

    if (u !== '.') {
      continue;
    }

    ++domainInc;

    offsetDomain = i;
  }

  offsetPath = i;

  i = offsetDomain;

  // Find offset before domain name.
  while (i-- !== 0) {
    const u = url[i];
    // Look for sub domain, protocol or basic auth
    if (!u || !starters.has(u)) {
      continue;
    }

    offsetStartSlice = i + 1;

    break;
  }

  if (offsetStartSlice === 0 && offsetPath > 3) {
    return url;
  }

  if (offsetStartSlice > 0 && offsetStartSlice < 2) {
    return '';
  }

  return url.slice(offsetStartSlice, offsetPath);
};
