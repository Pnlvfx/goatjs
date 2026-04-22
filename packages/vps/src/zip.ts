import { createDate } from '@goatjs/core/date/date';
import { storage } from '@goatjs/storage';
import AdmZip from 'adm-zip';
import path from 'node:path';

const archiveRoot = await storage.use('archives');

export const zipServer = async (name: string) => {
  const zip = new AdmZip();
  zip.addLocalFolder('dist', 'dist');
  zip.addLocalFolder('assets', 'assets');
  zip.addLocalFile('package.json');
  zip.addLocalFile('.env.production');
  zip.addLocalFile('yarn.lock');
  zip.addLocalFile('.yarnrc.yml');
  const filename = path.join(archiveRoot, createDate().yymmdd(), `${name}.zip`);
  return writeZipAsync(zip, filename);
};

const writeZipAsync = (zip: AdmZip, output: string) => {
  return new Promise<string>((resolve, reject) => {
    zip.writeZip(output, (error) => {
      if (error) reject(error);
      else resolve(output);
    });
  });
};
