import { loadConfigFile } from '../config.ts';
import { runPlugin } from '../run-plugin.ts';
import { createSshClient } from '../ssh.ts';

export const runPluginByName = async (name: string) => {
  const { host, projectName, plugins = {}, gcpCredentialsPath, nginx: nginxConfig } = await loadConfigFile();

  const plugin = plugins[name];
  if (!plugin) throw new Error(`Plugin "${name}" not found. Available: ${Object.keys(plugins).join(', ') || 'none'}`);

  const ssh = await createSshClient({ host });
  const ctx = { ssh, projectName, host, gcpCredentialsPath, nginx: nginxConfig };

  try {
    await runPlugin(name, plugin, ctx);
  } finally {
    ssh.dispose();
  }
};
