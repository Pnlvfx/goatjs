type StringToNumber<T extends string> = T extends `${infer N extends number}` ? N : number;

export const toNumber = <T extends string>(string: T) => {
  const num = Number(string);
  if (Number.isNaN(num)) throw new Error(`"${string}" is not a valid number.`);
  return num as StringToNumber<T>;
};

export const numberToString = <K extends number>(number: K) => {
  return number.toString() as `${K}`;
};
