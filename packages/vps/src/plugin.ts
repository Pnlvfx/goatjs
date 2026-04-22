import * as z from 'zod';
import type { Ssh } from './ssh.ts';

const pluginContextSchema = z.strictObject({
  ssh: z.custom<Ssh>(),
  projectName: z.string(),
  host: z.string(),
  gcpCredentialsPath: z.string(),
});

export const pluginSchema = z.function({ input: [pluginContextSchema], output: z.promise(z.void()) });

export type PluginContext = z.infer<typeof pluginContextSchema>;
export type Plugin = z.infer<typeof pluginSchema>;
