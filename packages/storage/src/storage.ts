import path from 'node:path';
import { rm } from 'node:fs/promises';
import { coralineRoot, cwd } from './config.js';
import { mkDir } from './helpers.js';

interface UseOptions {
  root?: boolean;
}

export const storage = {
  cwd,
  use: async (internalPath: string, { root }: UseOptions = {}) => {
    const rootDirectory = root ? coralineRoot : cwd;
    const directory = path.join(rootDirectory, internalPath);
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
  clearAll: () => rm(cwd, { recursive: true, force: true }),
  getUrlFromStaticPath: (coraPath: string, query?: Record<string, string>) => {
    if (!process.env['SERVER_URL']) throw new Error('Please add SERVER_URL to your env file to use this function');
    const extra_path = coraPath.split('/static/').at(1);
    if (!extra_path) throw new Error(`Invalid path provided: ${coraPath} should contain a static path!`);
    const queryString = new URLSearchParams(query).toString();
    return `${process.env['SERVER_URL']}/static/${extra_path}${queryString ? '?' + queryString : ''}`;
  },
  getPathFromStaticUrl: (url: string) => {
    const { pathname } = new URL(url);
    return path.join(cwd, pathname);
  },
};
