export const toNumber = (str: string) => {
  const num = Number(str);
  if (Number.isNaN(num)) throw new Error(`"${str}" is not a valid number.`);
  return num;
};

export const numberToString = <K extends number>(number: K) => {
  return number.toString() as `${K}`;
};
