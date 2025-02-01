export type Callback<T, Args extends unknown[] = []> = (...args: Args) => Promise<T> | T;
