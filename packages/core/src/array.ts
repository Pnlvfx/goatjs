export const arrayMove = <T>(arr: T[], fromIndex: number, toIndex: number) => {
  const el = arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, ...el);
};

export const getUniqueArray = <T extends Record<K, string>, K extends keyof T>(arr: T[], key: K): T[] => {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
};

export const shuffleArray = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    // eslint-disable-next-line sonarjs/pseudo-random
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    const val = array.at(j);
    if (!temp || !val) throw new Error('Something went wrong');
    array[i] = val;
    array[j] = temp;
  }
};
