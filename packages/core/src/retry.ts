import type { Callback } from './types.js';
import { errorToString } from './error.js';
import { wait } from './wait.js';

export interface RetryOptions {
  maxAttempts?: number;
  retryIntervalMs?: number;
  signal?: AbortController['signal'];
  ignoreWarnings?: boolean;
  failMessage?: (err: string, attempt: number) => string;
  shouldRetry?: (err: unknown, attempt: number) => boolean;
}

/** Run a function for the desired amount of times, if it fails the last retry, it will throw an error. */
export const withRetry = <T, Args extends unknown[]>(
  callback: Callback<T, Args>,
  { failMessage, ignoreWarnings, maxAttempts, retryIntervalMs = 1000, shouldRetry, signal }: RetryOptions = {},
) => {
  return (...args: Args): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      let attempt = 0;

      // eslint-disable-next-line sonarjs/cognitive-complexity
      const handle = async () => {
        try {
          const maybe = await callback(...args);
          resolve(maybe);
        } catch (err) {
          if (signal?.aborted) {
            reject(new Error('Aborted'));
            return;
          }
          if (attempt === maxAttempts || (shouldRetry && !shouldRetry(err, attempt))) {
            reject(err instanceof Error ? err : new Error(errorToString(err)));
            return;
          }
          if (process.env['NODE_ENV'] !== 'production') {
            if (failMessage) {
              // eslint-disable-next-line no-console
              console.log(failMessage(errorToString(err), attempt));
            }
            if (!ignoreWarnings && attempt > 10) {
              // eslint-disable-next-line no-console
              console.log(
                `Function fail, try again, error: ${errorToString(err)}, attempt: ${attempt.toString()}, maxAttempts: ${maxAttempts?.toString() ?? 'Infinity'}`,
              );
            }
          }
          await wait(retryIntervalMs);
          await handle();
          attempt++;
        }
      };

      void handle();
    });
  };
};
