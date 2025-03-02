import os from 'node:os';
import fs from 'node:fs';
import { getUserAgent } from './user-agent.js';
import path from 'node:path';
import mime from 'mime-types';
import { pipeline } from 'node:stream/promises';

export interface DownloadOptions {
  directory?: string;
  headers?: HeadersInit;
}

const defaultHeaders = {
  'user-agent': getUserAgent(),
};

/** Download a file from a given url. */
export const download = async (url: string, { headers = defaultHeaders, directory = path.join(os.homedir(), 'Downloads') }: DownloadOptions = {}) => {
  const res = await fetch(url, { headers });
  if (!res.ok || !res.body) throw new Error(`${res.status.toString()}: ${res.statusText}`);
  const output = path.join(directory, getFilename(url, res.headers));
  const fileStream = fs.createWriteStream(output);
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
  return match?.replace(/["']/g, '');
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
