import fs from 'node:fs/promises';
import * as z from 'zod';

const pkgJsonSchema = z.looseObject({
  name: z.string(),
  description: z.string().optional(),
  version: z.string().optional(),
  private: z.boolean().optional(),
  scripts: z.record(z.string(), z.string()).optional(),
  workspaces: z.array(z.string()).optional(),
  author: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
  dependencies: z.record(z.string(), z.string()).optional(),
  devDependencies: z.record(z.string(), z.string()).optional(),
  peerDependencies: z.record(z.string(), z.string()).optional(),
  packageManager: z.string().optional(),
  exports: z
    .record(z.string(), z.union([z.string(), z.record(z.string(), z.unknown())]))
    .nullable()
    .optional(),
});

export type PackageJSON = z.infer<typeof pkgJsonSchema>;

export const getPkgJSON = async (file: string) => {
  const buf = await fs.readFile(file);
  const { name, ...pkg } = await pkgJsonSchema.parseAsync(JSON.parse(buf.toString()));
  if (!name) throw new Error('Please add a valid name on your package.json.');
  return { name, ...pkg };
};

export const getRootPkgJSON = async () => getPkgJSON('package.json');
