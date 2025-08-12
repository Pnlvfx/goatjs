const endings = new Set(['/', ':', '?', '#']);
const starters = new Set(['.', '/', '@']);

// TODO [2025-08-15] POSSIBLY MOVE THIS ON GOATJS/core

export const getDomainFromUrl = (url: string) => {
  let domainInc = 0;
  let offsetDomain = 0;
  let offsetStartSlice = 0;
  let offsetPath = 0;
  let len = url.length;
  let i = 0;

  // Find end offset of domain
  while (len-- && ++i) {
    const u = url[i];
    if (domainInc && u && endings.has(u)) {
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
  while (i--) {
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
