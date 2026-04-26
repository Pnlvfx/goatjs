import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { getRootPkgJSON } from '@goatjs/node/package-json';
import { vpsConfigSchema } from './types/config.ts';
import * as z from 'zod';

const vpsConfigCjsSchema = z.strictObject({ default: vpsConfigSchema });

export const loadConfigFile = async () => {
  // eslint-disable-next-line no-restricted-properties
  const configPath = path.join(process.cwd(), 'vps.config.ts');
  const configUrl = pathToFileURL(configPath).href;
  const userConfig = (await import(configUrl)) as unknown;
  const validConfig = await vpsConfigCjsSchema.parseAsync(userConfig);
  const pkgJson = await getRootPkgJSON();
  return { projectName: pkgJson.name, ...validConfig.default };
};
