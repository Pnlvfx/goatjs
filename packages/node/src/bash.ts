import { spawn } from 'node:child_process';
import os from 'node:os';

export const bash = (scriptFile: string) => {
  return new Promise<void>((resolve, reject) => {
    const { args, command } = getSystemConfigs(scriptFile);
    const process = spawn(command, args);
    process.on('error', reject);

    let error = '';

    process.stderr.on('data', (chunk: Buffer) => {
      error += chunk.toString();
    });

    process.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(error));
    });
  });
};

const getSystemConfigs = (scriptFile: string) => {
  const platform = os.platform();
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
