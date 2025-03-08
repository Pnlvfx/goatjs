export const isUrl = (str: string) => {
  try {
    return !!new URL(str);
  } catch {
    return false;
  }
};

export const isJsonResponse = (res: Response) => res.headers.get('content-type')?.includes('application/json');
