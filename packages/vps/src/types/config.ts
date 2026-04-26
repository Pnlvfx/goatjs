import * as z from 'zod';
import { nginxConfigSchema } from './nginx.ts';
import { pluginSchema } from './plugin.ts';

export const vpsConfigSchema = z.strictObject({
  host: z.string(),
  gcpCredentialsPath: z.string(),
  plugins: z.array(pluginSchema).optional(),
  nginx: nginxConfigSchema,
});

export type VpsConfig = z.infer<typeof vpsConfigSchema>;
