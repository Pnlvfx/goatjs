const VALUE_CREATED = 'created';
const VALUE_UPDATED = 'updated';
const VALUE_DELETED = 'deleted';
const VALUE_UNCHANGED = 'unchanged';

type Primitive = string | number | boolean | undefined | null;
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

const isValue = (x: unknown): x is Primitive => {
  return !isObject(x) && !isArray(x);
};

const compareValues = (value1: unknown, value2: unknown) => {
  if (value1 === value2) return VALUE_UNCHANGED;
  if (isDate(value1) && isDate(value2) && value1.getTime() === value2.getTime()) return VALUE_UNCHANGED;
  if (value1 === undefined) return VALUE_CREATED;
  if (value2 === undefined) return VALUE_DELETED;
  return VALUE_UPDATED;
};

type ComparisonResult<T> = T extends Primitive
  ? { type: ValueChangeType; data: T }
  : T extends unknown[]
    ? Record<string, ComparisonResult<T[number]>>
    : T extends object
      ? { [K in keyof T]: ComparisonResult<T[K]> }
      : never;

export const createComparison = <T extends Record<string, unknown>>(obj1: T, obj2: T) => {
  if (isFunction(obj1) || isFunction(obj2)) throw new TypeError('Invalid argument. Function given, object expected.');
  if (isValue(obj1) || isValue(obj2)) {
    return {
      type: compareValues(obj1, obj2),
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      data: obj1 ?? obj2,
    } as ComparisonResult<T>;
  }

  const diff: Partial<ComparisonResult<T>> = {};

  for (const [key, value] of Object.entries(obj1)) {
    if (isFunction(value)) continue;

    let value2;

    if (obj2[key] !== undefined) {
      value2 = obj2[key];
    }

    /** @ts-expect-error Some mismatch here, i think it could be improved. */
    diff[key] = createComparison(obj1[key], value2);
  }

  for (const [key, value] of Object.entries(obj2)) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (isFunction(value) || diff[key] !== undefined) continue;
    /** @ts-expect-error Some mismatch here, i think it could be improved. */
    diff[key] = createComparison(undefined, value);
  }

  return diff as ComparisonResult<T>;
};
