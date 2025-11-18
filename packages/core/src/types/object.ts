export type FlatObjectKeys<T extends Record<string, unknown>, Key = keyof T> = Key extends string
  ? T[Key] extends Record<string, unknown>
    ? `${Key}.${FlatObjectKeys<T[Key]>}`
    : `${Key}`
  : never;
