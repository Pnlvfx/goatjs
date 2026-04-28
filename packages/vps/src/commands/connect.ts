import spawn from 'cross-spawn';
import { loadConfigFile } from '../config.ts';

export const connectToVps = async () => {
  const { host } = await loadConfigFile();

  await new Promise<void>((resolve, reject) => {
    const proc = spawn('ssh', [`root@${host}`], { stdio: 'inherit' });
    proc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`SSH exited with code ${code?.toString() ?? 'null'}`));
    });
    proc.on('error', reject);
  });
};
