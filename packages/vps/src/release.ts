import type { Ssh } from './ssh.ts';

const KEEP_RELEASES = 3;

export const backupCurrentRelease = async (ssh: Ssh, projectName: string) => {
  const timestamp = Date.now().toString();
  const projectDir = `/root/${projectName}`;
  const releasesDir = `/root/${projectName}-releases`;
  const backupDir = `${releasesDir}/${timestamp}`;

  await ssh.execCommand(`mkdir -p ${releasesDir}`);
  const { stdout } = await ssh.execCommand(`test -d ${projectDir} && echo yes || echo no`);
  if (stdout.trim() === 'yes') {
    await ssh.execCommand(`cp -r ${projectDir} ${backupDir}`);
  }

  return timestamp;
};

export const restoreRelease = async (ssh: Ssh, projectName: string, timestamp: string) => {
  const projectDir = `/root/${projectName}`;
  const backupDir = `/root/${projectName}-releases/${timestamp}`;
  await ssh.execCommand(`rm -rf ${projectDir}`);
  await ssh.execCommand(`mv ${backupDir} ${projectDir}`);
};

export const getLatestRelease = async (ssh: Ssh, projectName: string) => {
  const releasesDir = `/root/${projectName}-releases`;
  const { stdout } = await ssh.execCommand(`ls -1 ${releasesDir} 2>/dev/null | sort -n`);
  const releases = stdout.trim().split('\n').filter(Boolean);
  return releases.at(-1);
};

export const pruneOldReleases = async (ssh: Ssh, projectName: string) => {
  const releasesDir = `/root/${projectName}-releases`;
  const { stdout } = await ssh.execCommand(`ls -1 ${releasesDir} 2>/dev/null | sort -n`);
  const releases = stdout.trim().split('\n').filter(Boolean);
  const toDelete = releases.slice(0, Math.max(0, releases.length - KEEP_RELEASES));
  for (const release of toDelete) {
    await ssh.execCommand(`rm -rf ${releasesDir}/${release}`);
  }
};
