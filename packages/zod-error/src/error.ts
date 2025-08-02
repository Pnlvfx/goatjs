class ValidationError extends Error {
  data: unknown;
  constructor(message: string, data: unknown) {
    super(message);
    this.name = 'ValidationError';
    this.data = data;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export const validationError = (message: string, { data }: { data: unknown }) => {
  return new ValidationError(message, data);
};

export const isValidationError = (err: unknown) => {
  return err instanceof ValidationError;
};
