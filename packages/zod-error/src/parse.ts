import * as z from 'zod/v4/core';
import { validationError } from './error.ts';

/** Attach the data on zodError */
export const parseAsync = async <T extends z.$ZodType>(schema: T, value: unknown, _ctx?: z.ParseContext<z.$ZodIssue>): Promise<z.output<T>> => {
  const { success, error, data } = await z.safeParseAsync(schema, value, _ctx);
  if (!success) throw validationError(error.message, { data: value });
  return data;
};
