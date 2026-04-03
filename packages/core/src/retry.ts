/* eslint-disable no-console */
import type { Callback } from './types/callback.ts';
import { parseError } from './error.ts';
import { wait } from './wait.ts';

export interface RetryParams<T, Args extends unknown[]> {
  maxAttempts?: number;
  retryIntervalMs?: number;
  signal?: AbortSignal;
  debug?: boolean;
  handler: Callback<T, Args>;
  failMessage?: Callback<string, [err: unknown, attempt: number]>;
  shouldRetry?: Callback<boolean, [err: unknown, attempt: number]>;
  onError?: Callback<void, [err: unknown, attempt: number]>;
}

/** Run a function for the desired amount of times, if it fails the last retry, it will throw an error. */
export const withRetry = <T, Args extends unknown[]>({
  failMessage,
  debug,
  maxAttempts,
  retryIntervalMs = 1000,
  shouldRetry,
  onError,
  signal,
  handler,
}: RetryParams<T, Args>) => {
  return (...args: Args): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      let attempt = 1;

      const handle = async () => {
        try {
          const maybe = await handler(...args);
          resolve(maybe);
        } catch (err) {
          const parsedError = parseError(err);

          await onError?.(err, attempt);

          if (signal?.aborted) {
            reject(new Error('Aborted'));
            return;
          }

          if (attempt === maxAttempts || (shouldRetry && !(await shouldRetry(err, attempt)))) {
            reject(parsedError);
            return;
          }

          attempt++;

          if (failMessage) {
            console.log(await failMessage(parsedError.message, attempt));
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
