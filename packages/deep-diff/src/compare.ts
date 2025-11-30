import { compareValues, isFunction, isValue, type Primitive, type ValueChangeType } from './utils.js';

export type ComparisonResult<T> = T extends Primitive
  ? { type: ValueChangeType; data: T }
  : T extends unknown[]
    ? Record<string, ComparisonResult<T[number]>>
    : T extends object
      ? { [K in keyof T]: ComparisonResult<T[K]> }
      : never;

export const createComparison = <T extends Record<string, unknown>>(actual: T, expected: T) => {
  if (isFunction(actual) || isFunction(expected)) throw new TypeError('Invalid argument. Function given, object expected.');
  if (isValue(actual) || isValue(expected)) {
    return {
      type: compareValues(actual, expected),
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      data: actual ?? expected,
    } as ComparisonResult<T>;
  }

  const diff: Partial<ComparisonResult<T>> = {};

  for (const [key, value] of Object.entries(actual)) {
    if (isFunction(value)) continue;

    let value2;

    if (expected[key] !== undefined) {
      value2 = expected[key];
    }

    /** @ts-expect-error Some mismatch here, i think it could be improved. */
    diff[key] = createComparison(actual[key], value2);
  }

  for (const [key, value] of Object.entries(expected)) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (isFunction(value) || diff[key] !== undefined) continue;
    /** @ts-expect-error Some mismatch here, i think it could be improved. */
    diff[key] = createComparison(undefined, value);
  }

  return diff as ComparisonResult<T>;
};
