export const numberToString = <K extends number>(number: K) => number.toString() as `${K}`;

// most of the time we do if (!) on a number
// which will also affect 0 and maybe other numbers,
// this will correctly check
export const isNumber = (value: string | number | undefined | null): value is number => {
  if (typeof value === 'number') return true;
  if (value === undefined || value === null) return false;
  try {
    toNumber(value);
    return true;
  } catch {
    return false;
  }
};

type StringToNumber<T extends string> = T extends `${infer N extends number}` ? N : number;

export const toNumber = <T extends string>(string: T) => {
  if (string.trim() === '') throw new Error(`"${string}" is not a valid number.`);
  const num = Number(string);
  if (Number.isNaN(num)) throw new Error(`"${string}" is not a valid number.`);
  return num as StringToNumber<T>;
};
