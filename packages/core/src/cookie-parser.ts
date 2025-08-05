const sameSiteValues = [true, false, 'lax', 'strict', 'none'] as const;

type CookieSameSite = (typeof sameSiteValues)[number];

const isValidSameSite = (value: boolean | string): value is CookieSameSite => {
  return sameSiteValues.includes(value as CookieSameSite);
};

export interface Cookie {
  name: string;
  value: string;
  expires?: Date;
  maxAge?: number;
  secure?: boolean;
  path?: string;
  sameSite?: CookieSameSite;
  httpOnly?: boolean;
  domain?: string;
}

export const parseSetCookieHeader = (res: Response, { decodeValues = true } = {}): Cookie[] => {
  return res.headers
    .getSetCookie()
    .filter((str) => !!str.trim())
    .map((str) => parseString(str, decodeValues));
};

// eslint-disable-next-line sonarjs/cognitive-complexity
const parseString = (cookieString: string, decodeValues?: boolean): Cookie => {
  const parts = cookieString.split(';').filter((str) => !!str.trim());
  const nameValuePairStr = parts.shift();
  if (!nameValuePairStr) throw new Error('Error while trying to parse cookie string!');
  const parsed = parseNameValuePair(nameValuePairStr);
  const value = decodeValues ? decodeURIComponent(parsed.value) : parsed.value;
  const cookie: Cookie = {
    name: parsed.name,
    value,
  };
  for (const part of parts) {
    const sides = part.split('=');
    const key = sides.shift()?.trimStart().toLowerCase();
    const value = sides.join('=');
    if (key) {
      switch (key) {
        case 'expires': {
          cookie.expires = new Date(value);
          break;
        }
        case 'max-age': {
          // eslint-disable-next-line unicorn/prefer-number-properties
          cookie.maxAge = parseInt(value, 10);
          break;
        }
        case 'secure': {
          cookie.secure = true;
          break;
        }
        case 'httponly': {
          cookie.httpOnly = true;
          break;
        }
        case 'samesite': {
          // eslint-disable-next-line unicorn/no-nested-ternary, sonarjs/no-nested-conditional
          const parsedValue = value === 'true' ? true : value === 'false' ? false : value;
          if (isValidSameSite(parsedValue)) {
            cookie.sameSite = parsedValue;
          }
          break;
        }
        case 'path': {
          cookie.path = value;
          break;
        }
        case 'domain': {
          cookie.domain = value;
          break;
        }
        default: {
          throw new Error(`Received an unhandled key on cookie parser: ${key}`);
        }
      }
    }
  }
  return cookie;
};

const parseNameValuePair = (nameValuePairStr: string) => {
  let name = '';
  let value = '';
  const nameValueArr = nameValuePairStr.split('=');
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift() ?? '';
    value = nameValueArr.join('=');
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
};
