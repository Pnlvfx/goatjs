/* eslint-disable no-console */
import type { Callback } from './types/callback.js';
import { parseError } from './error.js';
import { wait } from './wait.js';

export interface RetryOptions {
  maxAttempts?: number;
  retryIntervalMs?: number;
  signal?: AbortSignal;
  debug?: boolean;
  failMessage?: (err: string, attempt: number) => string;
  shouldRetry?: (err: unknown, attempt: number) => boolean;
  onError?: (err: unknown, attempt: number) => void;
}

/** Run a function for the desired amount of times, if it fails the last retry, it will throw an error. */
export const withRetry = <T, Args extends unknown[]>(
  callback: Callback<T, Args>,
  { failMessage, debug, maxAttempts, retryIntervalMs = 1000, shouldRetry, onError, signal }: RetryOptions = {},
) => {
  return (...args: Args): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      let attempt = 0;

      const handle = async () => {
        try {
          const maybe = await callback(...args);
          resolve(maybe);
        } catch (err) {
          const parsedError = parseError(err);

          onError?.(err, attempt);

          if (signal?.aborted) {
            reject(new Error('Aborted'));
            return;
          }

          if (attempt === maxAttempts || (shouldRetry && !shouldRetry(err, attempt))) {
            reject(parsedError);
            return;
          }

          attempt++;

          if (failMessage) {
            console.log(failMessage(parsedError.message, attempt));
          }

          if (debug) {
            console.log(
              `Function fail, try again, error: ${parsedError.message}, attempt: ${attempt.toString()}, maxAttempts: ${maxAttempts?.toString() ?? 'Infinity'}`,
            );
          }

          await wait(retryIntervalMs);

          void handle();
        }
      };

      void handle();
    });
  };
};
