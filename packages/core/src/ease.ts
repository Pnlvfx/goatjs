export const isUrl = (str: string) => {
  try {
    // eslint-disable-next-line no-new
    new URL(str);
    return true;
  } catch {
    return false;
  }
};

export const isJsonResponse = (res: Response) => res.headers.get('content-type')?.includes('application/json');
