// On nodejs use setTimeout from 'node:timers/promises
export const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
