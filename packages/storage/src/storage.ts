import path from 'node:path';
import fs from 'node:fs/promises';
import { rm } from 'node:fs/promises';
import { cwd, root } from './config.js';

export const storage = {
  cwd,
  use: async (internalPath: string, { root: toRoot }: { root?: boolean } = {}) => {
    const rootDirectory = toRoot ? root : cwd;
    const directory = path.join(rootDirectory, internalPath);
    await fs.mkdir(directory, { recursive: true });
    return directory;
  },
  useStatic: async () => {
    const folder = path.join(cwd, 'static');
    await fs.mkdir(folder, { recursive: true });
    const imagePath = path.join(folder, 'images');
    await fs.mkdir(imagePath);
    const videoPath = path.join(folder, 'videos');
    await fs.mkdir(videoPath);
    return { staticPath: folder, imagePath, videoPath };
  },
  clearAll: () => rm(cwd, { recursive: true, force: true }),
  getUrlFromStaticPath: (coraPath: string, { host }: { host: string }) => {
    const extra_path = coraPath.split('/static/').at(1);
    if (!extra_path) throw new Error(`Invalid path provided: ${coraPath} should contain a static path!`);
    return `${host}/static/${extra_path}`;
  },
  getPathFromStaticUrl: (url: string) => {
    const { pathname } = new URL(url);
    return path.join(cwd, pathname);
  },
};
