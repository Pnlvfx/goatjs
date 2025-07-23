import path from 'node:path';
import { rm } from 'node:fs/promises';
import { coralineRoot, cwd } from './config.js';
import { mkDir } from './helpers.js';

export const storage = {
  cwd,
  /** Allow to use a single root folder for all projects. Used for file which are meant to be the same through different projects.
   * Eg: an app (tor for example)
   */
  useRoot: async (internalPath: string) => {
    const directory = path.join(coralineRoot, internalPath);
    await mkDir(directory);
    return directory;
  },
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
