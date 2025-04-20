/** @deprecated This function will soon become internal only so
 * proceed to migrate to the new "parseCatchError" alternative.
  */
export const errorToString = (err: unknown, ...args: string[]) => {
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
      error = `UNHANDLED API ERROR: ${JSON.stringify(err)}`;
      // eslint-disable-next-line no-console
      console.warn('ErrorToString was unable to parse:', err);
    } catch {
      error = `UNHANDLED API ERROR`;
      if (process.env['NODE_ENV'] !== 'production') {
        // eslint-disable-next-line no-console
        console.warn('ErrorToString was unable to parse:', err);
      }
    }
  }

  for (const value of args) {
    error += ' ' + value;
  }

  return error;
};

export const parseCatchError = (err: unknown) => {
  return err instanceof Error ? err : new Error(errorToString(err));
};
