/* eslint-disable sonarjs/function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

/** Wrap a function with this to avoid redefining types
 * eg: const errToUndefined = makeErrorWrapper((err) => undefined)
 * const response = errToUndefined(request)
 * instead of returning response or error, it will return response or undefined.
 */
export const makeErrorWrapper =
  <T>(errorHandler: (err: any) => T) =>
  <A extends any[], R>(fn: (...a: A) => R) =>
  (...a: A): R | T => {
    try {
      return fn(...a);
    } catch (err) {
      return errorHandler(err);
    }
  };

export const makeAsyncErrorWrapper =
  <T>(errorHandler: (err: any) => T) =>
  <A extends any[], R>(fn: (...a: A) => Promise<R>) =>
  async (...a: A): Promise<R | T> => {
    try {
      return await fn(...a);
    } catch (err) {
      return errorHandler(err);
    }
  };
