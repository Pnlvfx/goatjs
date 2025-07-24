import type { $ZodError } from 'zod/v4/core';

class ValidationError extends Error {
  data: unknown;
  zodError: $ZodError;
  constructor(message: string, data: unknown, zodError: $ZodError) {
    super(message);
    this.name = 'ValidationError';
    this.data = data;
    this.zodError = zodError;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export const validationError = (message: string, { data, zodError }: { data: unknown; zodError: $ZodError }) => {
  return new ValidationError(message, data, zodError);
};

export const isValidationError = (err: unknown) => {
  return err instanceof ValidationError;
};
