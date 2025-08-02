import { spawn, type SpawnOptions } from 'node:child_process';
import os from 'node:os';

export const terminal = (scriptFile: string, options: SpawnOptions = {}) => {
  const { args, command } = getSystemConfigs(scriptFile);
  return spawn(command, args, options);
};

const platform = os.platform();

const getSystemConfigs = (scriptFile: string) => {
  switch (platform) {
    case 'darwin': {
      return { command: 'open', args: ['-a', 'Terminal', scriptFile] };
    }
    case 'win32': {
      return { command: 'cmd.exe', args: ['/C', 'start', 'cmd.exe', '/K', scriptFile] };
    }
    case 'linux': {
      return { command: 'gnome-terminal', args: ['--', scriptFile] };
    }
    default: {
      throw new Error('Unsupported platform, please fill an issue if you need this script on other platforms.');
    }
  }
};
