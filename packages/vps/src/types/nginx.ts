import * as z from 'zod';

export const nginxConfigSchema = z.strictObject({ serverName: z.string(), port: z.number() });

export type NginxConfig = z.infer<typeof nginxConfigSchema>;
