/** Use this instead of Object.entries to get typed entries. */
export const getEntries = <T extends object>(obj: T) => {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
};

/** Use this instead of Object.keys to get typed keys. */
export const getKeys = <T extends object>(obj: T) => {
  return Object.keys(obj) as (keyof T)[];
};

/** Use this instead of Object.keys to get readonly keys.
 * Please notice that this will give "fake" readonly keys
 * We are not really freezing the keys
 * If you want to do that use Object.freeze on your own before passing the object here.
 */
export const getReadonlyKeys = <T extends object>(obj: T) => {
  return Object.keys(obj) as unknown as readonly (keyof T)[];
};

/** Use this instead of Object.values to get typed values. */
export const getValues = <T extends object>(obj: T) => {
  return Object.values(obj) as T[keyof T][];
};
