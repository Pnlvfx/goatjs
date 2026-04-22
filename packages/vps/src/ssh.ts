/* eslint-disable no-console */
import { NodeSSH, type SSHExecCommandOptions } from 'node-ssh';
import path from 'node:path';
import os from 'node:os';
import { consoleColor } from '@goatjs/node/console-color';

export const createSshClient = async ({ host }: { readonly host: string }) => {
  const home = os.homedir();

  const client = new NodeSSH();
  await client.connect({ host, username: 'root', privateKeyPath: path.join(home, '.ssh', 'id_ed25519') });
  consoleColor('blue', `connected to ${host}`);

  return {
    execCommand: async (command: string, options: SSHExecCommandOptions = {}) => {
      console.log('running', command, 'on vps');
      const { code, stderr } = await client.execCommand(command, {
        onStdout(chunk) {
          process.stdout.write(chunk.toString('utf8'));
        },
        onStderr(chunk) {
          process.stderr.write(chunk.toString('utf8'));
        },
        ...options,
      });

      if (code !== 0) throw new Error(`Command failed with exit code ${code?.toString() ?? 'null'}: ${command}\n${stderr}`);
    },
    putFile: async (localFile: string, remoteFile: string) => {
      return client.putFile(localFile, remoteFile);
    },
    dispose: () => {
      client.dispose();
    },
  };
};

export type Ssh = Awaited<ReturnType<typeof createSshClient>>;
