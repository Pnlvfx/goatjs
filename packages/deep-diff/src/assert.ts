/* eslint-disable sonarjs/no-nested-template-literals */
import { createComparison, type ComparisonResult } from './compare.js';
import { isArray, isDate, isObject, VALUE_CREATED, VALUE_DELETED, VALUE_UNCHANGED, VALUE_UPDATED } from './utils.js';

/** browser polyfill of assert.deepStrictEqual */
export const deepStrictEqual = <T extends Record<string, unknown>>(actual: T, expected: T, message?: string): void => {
  const comparison = createComparison(actual, expected);
  const differences = collectDifferences(comparison);

  if (differences.length > 0) {
    const errorMessage = message
      ? `${message}\n\nDifferences found:\n${differences.map((d) => `  - ${d}`).join('\n')}`
      : `Deep strict equality assertion failed:\n\nDifferences found:\n${differences.map((d) => `  - ${d}`).join('\n')}\n\nActual:\n${formatValue(actual)}\n\nExpected:\n${formatValue(expected)}`;

    throw new AssertionError(errorMessage, actual, expected, differences);
  }
};

interface ValueComparison {
  type: typeof VALUE_CREATED | typeof VALUE_UPDATED | typeof VALUE_DELETED | typeof VALUE_UNCHANGED;
  data: unknown;
}

const isValueComparison = (obj: unknown): obj is ValueComparison => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'type' in obj &&
    'data' in obj &&
    (obj.type === VALUE_CREATED || obj.type === VALUE_UPDATED || obj.type === VALUE_DELETED || obj.type === VALUE_UNCHANGED)
  );
};

const collectDifferences = <T extends Record<string, unknown>>(comparison: ComparisonResult<T>, path?: string): string[] => {
  const differences: string[] = [];

  if (isValueComparison(comparison)) {
    switch (comparison.type) {
      case VALUE_CREATED: {
        differences.push(`${path ?? 'root'}: missing in actual (expected: ${formatValue(comparison.data)})`);
        break;
      }
      case VALUE_DELETED: {
        differences.push(`${path ?? 'root'}: unexpected in actual (value: ${formatValue(comparison.data)})`);
        break;
      }
      case VALUE_UPDATED: {
        differences.push(`${path ?? 'root'}: values differ`);
        break;
      }
    }
  } else {
    for (const [key, value] of Object.entries(comparison)) {
      differences.push(...collectDifferences(value, path ? `${path}.${key}` : key));
    }
  }

  return differences;
};

class AssertionError extends Error {
  actual: unknown;
  expected: unknown;
  operator: string;
  differences: string[];

  constructor(message: string, actual: unknown, expected: unknown, differences: string[]) {
    super(message);
    this.name = 'AssertionError';
    this.actual = actual;
    this.expected = expected;
    this.operator = 'deepStrictEqual';
    this.differences = differences;
  }
}

const formatValue = (value: unknown): string => {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') return `'${value}'`;
  if (isDate(value)) return value.toISOString();
  if (isArray(value)) return `[${value.map((v) => formatValue(v)).join(', ')}]`;
  // eslint-disable-next-line unicorn/no-null
  if (isObject(value)) return JSON.stringify(value, null, 2);
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  return String(value);
};
