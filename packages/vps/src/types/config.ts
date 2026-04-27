import * as z from 'zod';
import { nginxConfigSchema } from './nginx.ts';
import { pluginSchema } from './plugin.ts';

export const vpsConfigSchema = z.strictObject({
  host: z.string(),
  gcpCredentialsPath: z.string(),
  plugins: z.record(z.string(), pluginSchema).optional(),
  nginx: nginxConfigSchema,
});

export type VpsConfig = z.infer<typeof vpsConfigSchema>;
export type Plugins = z.infer<typeof vpsConfigSchema.shape.plugins>;
