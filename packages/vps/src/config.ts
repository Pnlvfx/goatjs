import path from 'node:path';
import { pathToFileURL } from 'node:url';
import * as z from 'zod';

const defaultConfig = { eslint: true };

const vpsConfigSchema = z.strictObject({
  projectName: z.string(), // TODO use pkg.json
  host: z.string(),
  plugins: z.array().optional(),
});

export type VpsConfig = z.infer<typeof vpsConfigSchema>;

export const loadConfigFile = async (): Promise<VpsConfig> => {
  // eslint-disable-next-line no-restricted-properties
  const configPath = path.join(process.cwd(), 'vps.config.ts');
  const configUrl = pathToFileURL(configPath).href;
  const userConfig = (await import(configUrl)) as unknown;
  const validConfig = await vpsConfigSchema.parseAsync(userConfig);
  return { ...defaultConfig, ...validConfig };
};
