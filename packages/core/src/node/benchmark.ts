/* eslint-disable no-console */

import type { Callback } from '../types.js';

export const benchmark = async <T>(name: string, callback: Callback<T>) => {
  console.time(name);
  try {
    const maybe = await callback();
    console.timeEnd(name);
    return maybe;
  } catch (err) {
    console.timeEnd(name);
    throw err;
  }
};
