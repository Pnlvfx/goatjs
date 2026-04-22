import path from 'node:path';
import { pathToFileURL } from 'node:url';
import * as z from 'zod';
import { pluginSchema } from './plugin.ts';
import { getRootPkgJSON } from '@goatjs/node/package-json';

export const nginxConfigSchema = z.strictObject({ serverName: z.string(), port: z.number() });

const vpsConfigSchema = z.strictObject({
  host: z.string(),
  gcpCredentialsPath: z.string(),
  plugins: z.array(pluginSchema).optional(),
  nginx: nginxConfigSchema,
});

export type NginxConfig = z.infer<typeof nginxConfigSchema>;
export type VpsConfig = z.infer<typeof vpsConfigSchema>;

export const loadConfigFile = async () => {
  // eslint-disable-next-line no-restricted-properties
  const configPath = path.join(process.cwd(), 'vps.config.ts');
  const configUrl = pathToFileURL(configPath).href;
  const userConfig = (await import(configUrl)) as unknown;
  const validConfig = await vpsConfigSchema.parseAsync(userConfig);
  const pkgJson = await getRootPkgJSON();
  return { projectName: pkgJson.name, ...validConfig };
};
