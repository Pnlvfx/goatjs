const VALUE_CREATED = 'created';
const VALUE_UPDATED = 'updated';
const VALUE_DELETED = 'deleted';
const VALUE_UNCHANGED = 'unchanged';

type ValueChangeType = typeof VALUE_CREATED | typeof VALUE_UPDATED | typeof VALUE_DELETED | typeof VALUE_UNCHANGED;

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const isFunction = (x: unknown): x is Function => {
  return Object.prototype.toString.call(x) === '[object Function]';
};

const isArray = (x: unknown): x is unknown[] => {
  return Object.prototype.toString.call(x) === '[object Array]';
};

const isDate = (x: unknown): x is Date => {
  return Object.prototype.toString.call(x) === '[object Date]';
};

const isObject = (x: unknown): x is object => {
  return Object.prototype.toString.call(x) === '[object Object]';
};

const isValue = (x: unknown): x is string | number | boolean | undefined | null => {
  return !isObject(x) && !isArray(x);
};

const compareValues = (value1: unknown, value2: unknown) => {
  if (value1 === value2) {
    return VALUE_UNCHANGED;
  }
  if (isDate(value1) && isDate(value2) && value1.getTime() === value2.getTime()) {
    return VALUE_UNCHANGED;
  }
  if (value1 === undefined) {
    return VALUE_CREATED;
  }
  if (value2 === undefined) {
    return VALUE_DELETED;
  }
  return VALUE_UPDATED;
};

type ComparisonResult<T> = T extends string | number | boolean | null | undefined
  ? { type: ValueChangeType; data: T }
  : T extends unknown[]
    ? Record<string, ComparisonResult<T[number]>>
    : T extends object
      ? { [K in keyof T]: ComparisonResult<T[K]> }
      : never;

// @TODO add getEntries (we have to move this library outof this repo)

export const createComparison = <T>(obj1: T, obj2: T) => {
  if (isFunction(obj1) || isFunction(obj2)) {
    throw new TypeError('Invalid argument. Function given, object expected.');
  }
  if (isValue(obj1) || isValue(obj2)) {
    return {
      type: compareValues(obj1, obj2),
      data: obj1 ?? obj2,
    } as ComparisonResult<T>;
  }

  const diff: Partial<ComparisonResult<T>> = {};

  for (const [key, value] of Object.entries(obj1)) {
    if (isFunction(value)) continue;

    let value2: unknown;

    if ((obj2 as Record<string, unknown>)[key] !== undefined) {
      value2 = (obj2 as Record<string, unknown>)[key];
    }

    diff[key] = createComparison((obj1 as Record<string, unknown>)[key], value2);
  }

  for (const [key, value] of Object.entries(obj2)) {
    if (isFunction(value) || diff[key] !== undefined) continue;
    diff[key] = createComparison(undefined, value);
  }

  return diff as ComparisonResult<T>;
};
