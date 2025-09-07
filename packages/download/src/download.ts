import os from 'node:os';
import path from 'node:path';
import mime from 'mime-types';
import { pipeline } from 'node:stream/promises';
import { createWriteStream } from 'node:fs';
import { getUserAgent } from '@goatjs/node/user-agent';
import { sanitize } from '@goatjs/node/sanitize';
import fs from 'node:fs/promises';

export interface DownloadOptions {
  /** The directory in which the file will be stored. */
  directory?: string;
  /** Add a custom headers for the request. */
  headers?: HeadersInit;
  /** Allow the downloader to override an existing file.
   * @default true
   */
  override?: boolean;
}

const defaultHeaders = new Headers({ 'user-agent': getUserAgent() });

const systemDownloadDirectory = path.join(os.homedir(), 'Downloads');

/** Download a file from a given url. */
export const download = async (
  url: string,
  { headers = defaultHeaders, directory = systemDownloadDirectory, override = true }: DownloadOptions = {},
) => {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${res.status.toString()}: ${res.statusText}`);
  if (!res.body) throw new Error('It looks like there is nothing to download at this url.');
  const filename = sanitize(getFilename(url, res.headers));
  if (!override) {
    await fs.access(filename);
  }
  const output = path.join(directory, filename);
  const fileStream = createWriteStream(output);
  await pipeline(res.body, fileStream);
  return output;
};

const getFilename = (url: string, headers: Headers) => {
  const filenameFromContentDisposition = getFileNameFromContentDisposition(headers.get('content-disposition'));
  if (filenameFromContentDisposition) return filenameFromContentDisposition;
  const urlPath = new URL(url).pathname;
  if (path.extname(url)) return path.basename(urlPath);
  const filenameFromContentType = getFileNameFromContentType(urlPath, headers.get('content-type'));
  if (filenameFromContentType) return filenameFromContentType;
  throw new Error(
    "Unable to provide a filename for this url. Please provide a filename yourself or feel free to report an issue, and we'll try to address it.",
  );
};

const filenameRegex = /filename[^\n;=]*=((["']).*?\2|[^\n;]*)/;

const getFileNameFromContentDisposition = (contentDisposition: string | null) => {
  if (!contentDisposition?.includes('filename=')) return;
  const match = filenameRegex.exec(contentDisposition)?.at(1);
  return match?.replaceAll(/["']/g, '');
};

const getFileNameFromContentType = (url: string, contentType: string | null) => {
  if (!contentType) return;
  const extension = mime.extension(contentType);
  if (!extension) return;
  const withoutExt = removeExtension(path.basename(url));
  return `${withoutExt}.${extension}`;
};

const removeExtension = (str: string) => {
  const arr = str.split('.');
  if (arr.length === 1) return str;
  return arr.slice(0, -1).join('.');
};
