import type { PluginContext } from '../types/plugin.ts';

export const mongo = async ({ ssh }: PluginContext) => {
  await ssh.execCommand('sudo apt-get install gnupg curl');
  await ssh.execCommand(
    'curl -fsSL https://pgp.mongodb.com/server-8.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
   --dearmor',
  );
  await ssh.execCommand(
    'echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list',
  );
  await ssh.execCommand('sudo apt-get update');
  await ssh.execCommand('sudo apt install -y mongodb-org-server');
  await ssh.execCommand('sudo systemctl start mongod');
  await ssh.execCommand('sudo systemctl enable mongod');

  await ssh.execCommand('sudo apt-get install -y mongodb-database-tools'); // to run backups, restores ecc
};
