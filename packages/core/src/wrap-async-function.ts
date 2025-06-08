/** @deprecated This is not a good solution to your error */
export const wrapAsyncFunction = <ARGS extends unknown[]>(fn: (...args: ARGS) => Promise<unknown>): ((...args: ARGS) => void) => {
  return (...args) => {
    void fn(...args);
  };
};
