import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import { cpdir } from './cpdir.js';

/** @TODO use a config to check what path exist and what should be created,
 * allow auto update if user delete folder from outside the node env and update the value to allow easy resolution.
 */

// interface StorageConfig {
//   cwd: string;
// }

// const getConfigs = async (cwd: string): Promise<StorageConfig> => {
//   const configFile = path.join(cwd, '.config');
//   try {
//     const buf = await fs.readFile(configFile);
//     return JSON.parse(buf.toString()) as StorageConfig;
//   } catch {
//     const configs = { cwd }; // add more initial configs here.
//     await fs.writeFile(configFile, JSON.stringify(configs));
//     return configs;
//   }
// };

const getProjectName = async () => {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const buf = await fs.readFile(packageJsonPath);
  const { name } = JSON.parse(buf.toString()) as { name?: string };
  if (!name) throw new Error('Unable to find package.json name.');
  return name.replace('api-', '');
};

const exist = async (file: string) => {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
};

const mkDir = async (folder: string, recursive?: boolean) => {
  if (await exist(folder)) return;
  checkPath(folder);
  await fs.mkdir(folder, { recursive });
};

const checkPath = (pth: string) => {
  if (process.platform === 'win32') {
    const pathHasInvalidWinCharacters = /["*:<>?|]/.test(pth.replace(path.parse(pth).root, ''));

    if (pathHasInvalidWinCharacters) {
      throw new Error(`Path contains invalid characters: ${pth}`);
    }
  }
};

const clearFolder = async (folder: string) => {
  const contents = await fs.readdir(folder);
  for (const content of contents) {
    await fs.rm(path.join(folder, content));
  }
};

const cwd = path.join(os.homedir(), '.coraline', await getProjectName());
// const configs = await getConfigs(cwd);
await mkDir(cwd, true);

const logPath = path.join(cwd, 'log');
await mkDir(logPath);

export const storage = {
  cwd,
  use: async (internalPath: string) => {
    const directory = path.join(cwd, internalPath);
    await mkDir(directory);
    return directory;
  },
  useStatic: async () => {
    const folder = path.join(cwd, 'static');
    await mkDir(folder);
    const imagePath = path.join(folder, 'images');
    await mkDir(imagePath);
    const videoPath = path.join(folder, 'videos');
    await mkDir(videoPath);
    return { staticPath: folder, imagePath, videoPath };
  },
  clearAll: () => clearFolder(cwd),
  reset: () => fs.rm(cwd),
  // FS HELPERS
  getUrlFromStaticPath: (coraPath: string, query?: Record<string, string>) => {
    if (!process.env['SERVER_URL']) throw new Error('Please add SERVER_URL to your env file to use this function');
    const extra_path = coraPath.split('/static/').at(1);
    if (!extra_path) throw new Error(`Invalid path provided: ${coraPath} should contain a static path!`);
    const queryString = new URLSearchParams(query).toString();
    return `${process.env['SERVER_URL']}/static/${extra_path}${queryString ? '?' + queryString : ''}`;
  },
  getPathFromUrl: (url: string) => {
    const { pathname } = new URL(url);
    return path.join(cwd, pathname);
  },
  exist,
  clearFolder,
  logToFile: async (data: string, { extension = 'json', title = 'Log stored at:' } = {}) => {
    const file = path.join(logPath, `${crypto.randomBytes(5).toString('hex')}.${extension}`);
    await fs.writeFile(file, data);
    // eslint-disable-next-line no-console
    console.log(title, file);
  },
  cpdir,
};
