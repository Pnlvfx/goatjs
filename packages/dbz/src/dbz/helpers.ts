import { getRootPkgJSON } from '@goatjs/node/package-json';
import { git } from '@goatjs/node/git/git';
import { execAsync } from '@goatjs/node/exec';
import { spawn } from 'node:child_process';

export const checkGitStatus = async ({ cwd }: { cwd?: string } = {}) => {
  const changes = await git.status({ porcelain: true, cwd });
  if (changes) throw new Error('You have uncommitted changes, please resolve them before continuing...');
};

export const isMonorepo = async () => {
  const pkg = await getRootPkgJSON();
  return Array.isArray(pkg.workspaces);
};

interface YarnConfig {
  key: string;
  effective: string;
  source: string;
  description: string;
  type: 'STRING';
  default: null;
}

export const getPublishRegistryUrl = async () => {
  const { stdout } = await execAsync('yarn config npmPublishRegistry --json');
  const json = JSON.parse(stdout) as YarnConfig;
  return json.effective;
};

export const spawnInteractive = async (command: string, args: string[] = []) => {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code?.toString() ?? ''}`));
      }
    });

    child.on('error', reject);
  });
};

export const getAccessToken = async () => {
  const { stdout } = await execAsync('gcloud auth print-access-token');
  return stdout.trim();
};
