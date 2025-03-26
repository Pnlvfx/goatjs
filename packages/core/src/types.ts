export type NonPromiseCallback<T, Args extends unknown[] = []> = (...args: Args) => T;
export type Callback<T, Args extends unknown[] = []> = (...args: Args) => Promise<T> | T;
