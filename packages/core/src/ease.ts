export const isUrl = (str: string) => {
  try {
    return !!new URL(str);
  } catch {
    return false;
  }
};

export const isJson = (res: Response) => res.headers.get('content-type')?.includes('application/json');
