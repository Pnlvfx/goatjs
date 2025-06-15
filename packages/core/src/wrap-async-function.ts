/** This is not a good solution for client side applications,
 * that why we moved it on the node package, if you are in server side you can use the
 * node export as this will be removed soon.
 * this can affect how event dom behave, you must wrap your function in your own,
 * especially if you are using the event parameter.
 * @deprecated
 */
export const wrapAsyncFunction = <ARGS extends unknown[]>(fn: (...args: ARGS) => Promise<unknown>): ((...args: ARGS) => void) => {
  return (...args) => {
    void fn(...args);
  };
};
