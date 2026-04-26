import type { Plugin, PluginContext } from './types/plugin.ts';
import { input } from '@goatjs/node/input';

export const runPlugin = async (name: string, plugin: Plugin, ctx: PluginContext) => {
  await input.create({ title: `Install ${name}?` });
  await plugin(ctx);
};
