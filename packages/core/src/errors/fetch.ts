class FetchError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'FetchError';
    Object.setPrototypeOf(this, FetchError.prototype);
  }
}

export const fetchError = (message: string, { status }: { status: number }) => {
  return new FetchError(message, status);
};

export const isFetchError = (err: unknown) => {
  return err instanceof FetchError;
};
