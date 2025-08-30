export const capitalize = (string: string) => {
  const firstLetter = string.at(0);
  if (!firstLetter) return string;
  return firstLetter.toUpperCase() + string.slice(1);
};
