import fs from 'node:fs/promises';
import z from 'zod';

// eslint-disable-next-line no-restricted-properties
const partialPkgSchema = z.object({
  name: z.string(),
});

export const getProjectName = async () => {
  const buf = await fs.readFile('package.json');
  const { name } = await partialPkgSchema.parseAsync(JSON.parse(buf.toString()));
  if (!name) throw new Error('Unable to find package.json name.');
  const [scope, subname] = name.split('/');
  const nameOnly = scope ? subname : name.replace('api-', '');
  if (!nameOnly) throw new Error('Unable to parse package.json name.');
  return { scope: scope?.slice(1), name: nameOnly };
};

export const mkDir = async (folder: string, recursive?: boolean) => {
  try {
    await fs.mkdir(folder, { recursive });
  } catch {}
};
