import type { Ssh } from '../ssh.ts';

export const updateSystem = async (ssh: Ssh) => {
  await ssh.execCommand('sudo apt update');
  await ssh.execCommand('sudo apt upgrade -y');
};
