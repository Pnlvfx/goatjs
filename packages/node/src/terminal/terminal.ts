import { spawn, type SpawnOptions } from 'node:child_process';
import { getSystemConfigs } from './helpers.js';

export const terminal = {
  open: (scriptFile: string, options: SpawnOptions = {}) => {
    const { args, command } = getSystemConfigs(scriptFile);
    return spawn(command, args, options);
  },
};
