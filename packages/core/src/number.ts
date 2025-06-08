export const toNumber = (string: string) => {
  const num = Number(string);
  if (Number.isNaN(num)) throw new Error(`"${string}" is not a valid number.`);
  return num;
};

export const numberToString = <K extends number>(number: K) => {
  return number.toString() as `${K}`;
};
