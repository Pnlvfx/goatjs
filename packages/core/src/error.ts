import { isFetchError } from './errors/fetch.ts';

export const parseError = (err: unknown) => {
  if (Error.isError(err) || isFetchError(err)) return err;
  return new Error(errorToString(err));
};

const errorToString = (err: unknown) => {
  let error = '';
  if (typeof err === 'string') {
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
      console.warn('Unable to parse', err);
    }
  }

  return error;
};
