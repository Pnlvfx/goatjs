import type { Ssh } from '../ssh.ts';
import * as z from 'zod';
import { nginxConfigSchema } from './nginx.ts';

const pluginContextSchema = z.strictObject({
  ssh: z.custom<Ssh>(),
  projectName: z.string(),
  host: z.string(),
  gcpCredentialsPath: z.string(),
  nginx: nginxConfigSchema,
});

export const pluginSchema = z.function({ input: [pluginContextSchema], output: z.promise(z.void()) });

export type PluginContext = z.infer<typeof pluginContextSchema>;
export type Plugin = z.infer<typeof pluginSchema>;
