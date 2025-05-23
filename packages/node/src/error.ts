export const isFsError = (error: unknown): error is NodeJS.ErrnoException => {
  return error instanceof Error;
};
