import { isFetchError } from './errors/fetch.ts';

export const parseError = (err: unknown) => {
  // error.isError is suggested and should replace instanceof
  // but for this helper we still need to parse whatever we get so we used both
  if (Error.isError(err) || err instanceof Error || isFetchError(err)) return err;
  return new Error(errorToString(err));
};

const errorToString = (err: unknown) => {
  let error = '';
  if (typeof err === 'object' && err !== null && 'message' in err && err.message === 'string') {
    error = err.message;
  } else if (typeof err === 'string') {
    error += err;
  } else {
    try {
      error = JSON.stringify(err);
    } catch {
      error = 'Unknown Error';
    }
    // eslint-disable-next-line no-restricted-properties
    if (process.env['NODE_ENV'] !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[parse-error]', 'Unable to parse', err);
    }
  }

  return error;
};
