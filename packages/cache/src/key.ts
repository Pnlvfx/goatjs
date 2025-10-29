import assert from 'node:assert';

export const hasSameKeys = (actual: string[], expected: string[]) => {
  try {
    assert.deepStrictEqual(actual, expected);
    return true;
  } catch {
    return false;
  }
};
