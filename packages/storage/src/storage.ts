import path from 'node:path';
import fs from 'node:fs/promises';
import { rm } from 'node:fs/promises';
import { cwd, root } from './config.ts';

export const storage = {
  cwd,
  use: async (dir: string, { root: toRoot }: { root?: boolean } = {}) => {
    const rootDirectory = toRoot ? root : cwd;
    const directory = path.join(rootDirectory, dir);
    await fs.mkdir(directory, { recursive: true });
    return directory;
  },
  useStatic: async () => {
    const staticPath = path.join(cwd, 'static');
    const imagePath = path.join(staticPath, 'images');
    const videoPath = path.join(staticPath, 'videos');
    try {
      await fs.mkdir(staticPath);
      await fs.mkdir(imagePath);
      await fs.mkdir(videoPath);
    } catch {}

    return { staticPath, imagePath, videoPath };
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
