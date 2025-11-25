export const arrayMove = (arr: unknown[], fromIndex: number, toIndex: number) => {
  const el = arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, ...el);
};

export const getUniqueArrayByKey = <T extends Record<K, string>, K extends keyof T>(arr: T[], key: K): T[] => {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
};

export const shuffleArray = (array: unknown[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    // eslint-disable-next-line sonarjs/pseudo-random
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    const val = array.at(j);
    array[i] = val;
    array[j] = temp;
  }
};

export const getDuplicates = <T>(array: T[]) => {
  return array.filter((e, i, a) => a.indexOf(e) !== i);
};
