class ValidationError extends Error {
  data: unknown;
  constructor(message: string, data: unknown) {
    super(message);
    this.name = 'ValidationError';
    // eslint-disable-next-line no-restricted-properties
    this.data = process.env['NODE_ENV'] === 'production' ? undefined : data;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export const validationError = (message: string, { data }: { data: unknown }) => {
  return new ValidationError(message, data);
};

export const isValidationError = (err: unknown) => {
  return err instanceof ValidationError;
};
