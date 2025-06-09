import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';

// TODO check the result of this in a monorepo setup
const getProjectName = async () => {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const buf = await fs.readFile(packageJsonPath);
  const { name } = JSON.parse(buf.toString()) as { name?: string };
  if (!name) throw new Error('Unable to find package.json name.');
  return name.replace('api-', '');
};

// TODO We have to use the goatjs/node/fs import instead of this, but it will break the build I think
/** @deprecated use import {fs} from "@goatjs/core/fs" */
const exist = async (file: string) => {
  try {
    // eslint-disable-next-line no-restricted-properties
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
};

const mkDir = async (folder: string, recursive?: boolean) => {
  // eslint-disable-next-line @typescript-eslint/no-deprecated
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

const cwd = path.join(os.homedir(), '.coraline', await getProjectName());
await mkDir(cwd, true);

const logPath = path.join(cwd, 'log');
await mkDir(logPath);

export const storage = {
  cwd,
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  exist,
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
  clearAll: () => fs.rm(cwd, { recursive: true, force: true }),
  logToFile: async (data: string, { extension = 'json', name = 'Log' } = {}) => {
    const file = path.join(logPath, `${crypto.randomBytes(5).toString('hex')}.${extension}`);
    await fs.writeFile(file, data);
    // eslint-disable-next-line no-console
    console.log(name, 'stored at:', file);
  },
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
};
