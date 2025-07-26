export const getNextArg = (args: string[], acceptMore: boolean) => {
  if (!acceptMore && args.length > 1) throw new Error('Invalid command.');
  const arg = args.shift();
  if (!arg) throw new Error('No argument found!');
  return arg;
};
