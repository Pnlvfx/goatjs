export const VALUE_CREATED = 'created';
export const VALUE_UPDATED = 'updated';
export const VALUE_DELETED = 'deleted';
export const VALUE_UNCHANGED = 'unchanged';

export type Primitive = string | number | boolean | undefined | null;
export type ValueChangeType = typeof VALUE_CREATED | typeof VALUE_UPDATED | typeof VALUE_DELETED | typeof VALUE_UNCHANGED;

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const isFunction = (x: unknown): x is Function => {
  return Object.prototype.toString.call(x) === '[object Function]';
};

export const isArray = (x: unknown): x is unknown[] => {
  return Object.prototype.toString.call(x) === '[object Array]';
};

export const isDate = (x: unknown): x is Date => {
  return Object.prototype.toString.call(x) === '[object Date]';
};

export const isObject = (x: unknown): x is object => {
  return Object.prototype.toString.call(x) === '[object Object]';
};

export const isValue = (x: unknown): x is Primitive => {
  return !isObject(x) && !isArray(x);
};

export const compareValues = (value1: unknown, value2: unknown) => {
  if (value1 === value2) return VALUE_UNCHANGED;
  if (isDate(value1) && isDate(value2) && value1.getTime() === value2.getTime()) return VALUE_UNCHANGED;
  if (value1 === undefined) return VALUE_CREATED;
  if (value2 === undefined) return VALUE_DELETED;
  return VALUE_UPDATED;
};
