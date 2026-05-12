import type { Plugin, PluginContext } from './types/plugin.ts';
import { createInterface } from 'node:readline/promises';

export const runPlugin = async (name: string, plugin: Plugin, ctx: PluginContext) => {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  await rl.question(`Install ${name}? Press Enter to continue.`);
  rl.close();
  await plugin(ctx);
};
