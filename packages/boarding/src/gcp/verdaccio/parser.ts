import { z } from 'zod';

const distSchema = z.strictObject({
  shasum: z.string(),
  integrity: z.string(),
  tarball: z.url(),
});

// eslint-disable-next-line no-restricted-properties
const versionSchema = z.object({
  name: z.string(),
  dist: distSchema,
});

// eslint-disable-next-line no-restricted-properties
export const packageSchema = z.object({
  name: z.string(),
  versions: z.record(z.string(), versionSchema),
  'dist-tags': z.strictObject({ latest: z.string() }),
});
