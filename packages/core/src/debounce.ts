// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const debounce = <T extends Function, Args extends (...args: unknown[]) => T>(func: T, wait: number, leading = false) => {
  let timeout: NodeJS.Timeout | undefined;

  return (...args: Parameters<Args>) => {
    clearTimeout(timeout);
    if (leading && !timeout) {
      func.apply(this, args);
    }
    timeout = setTimeout(() => {
      timeout = undefined;
      if (!leading) {
        func.apply(this, args);
      }
    }, wait);
  };
};

// temporary change for releasing
