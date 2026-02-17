import { wait } from './wait.ts';

export const backOff = <T>(fn: () => Promise<T>, maxAttempt = 5, baseDelayMs = 1000) => {
  let attempt = 1;

  const execute = async (): Promise<T> => {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= maxAttempt) throw err;
      const delayMs = baseDelayMs * 2 ** attempt;
      // eslint-disable-next-line no-restricted-properties
      if (process.env['NODE_ENV'] !== 'production') {
        // eslint-disable-next-line no-console
        console.log(`Retry attempt ${attempt.toString()} after ${delayMs.toString()}ms`);
      }
      await wait(delayMs);
      attempt++;
      return execute();
    }
  };

  return execute();
};
