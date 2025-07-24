export const parseCatchError = (err: unknown) => {
  return err instanceof Error ? err : new Error(errorToString(err));
};

const errorToString = (err: unknown, ...args: string[]) => {
  let error = '';
  if (err instanceof Error) {
    error += err.message;
  } else if (typeof err === 'string') {
    error += err;
  } else if (typeof err === 'object' && err !== null && 'description' in err) {
    const des = err.description;
    if (typeof des === 'string') {
      error += des;
    }
  } else {
    try {
      error = `UNHANDLED ERROR: ${JSON.stringify(err)}`;
    } catch {
      error = 'UNHANDLED ERROR';
    }
    // eslint-disable-next-line no-restricted-properties
    if (process.env['NODE_ENV'] !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('Unable to parse', err);
    }
  }

  for (const value of args) {
    error += ' ' + value;
  }

  return error;
};
