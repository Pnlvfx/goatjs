import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// https://github.com/isaacs/package-json-from-dist/blob/main/src/index.ts
// LATEST UPDATE 19/06/2025

const NM = `${path.sep}node_modules${path.sep}`;
const STORE = `.store${path.sep}`;
const PKG = `${path.sep}package${path.sep}`;
const DIST = `${path.sep}dist${path.sep}`;

/**
 * Find the package.json file, either from a TypeScript file somewhere not
 * in a 'dist' folder, or a built and/or installed 'dist' folder.
 *
 * Note: this *only* works if you build your code into `'./dist'`, and that the
 * source path does not also contain `'dist'`! If you don't build into
 * `'./dist'`, or if you have files at `./src/dist/dist.ts`, then this will
 * not work properly!
 *
 * The default `pathFromSrc` option assumes that the calling code lives one
 * folder below the root of the package. Otherwise, it must be specified.
 *
 * Example:
 *
 * ```ts
 * // src/index.ts
 * import { findPackageJson } from 'package-json-from-dist'
 *
 * const pj = findPackageJson(import.meta.url)
 * console.log(`package.json found at ${pj}`)
 * ```
 *
 * If the caller is deeper within the project source, then you must provide
 * the appropriate fallback path:
 *
 * ```ts
 * // src/components/something.ts
 * import { findPackageJson } from 'package-json-from-dist'
 *
 * const pj = findPackageJson(import.meta.url, '../../package.json')
 * console.log(`package.json found at ${pj}`)
 * ```
 *
 * When running from CommmonJS, use `__filename` instead of `import.meta.url`
 *
 * ```ts
 * // src/index.cts
 * import { findPackageJson } from 'package-json-from-dist'
 *
 * const pj = findPackageJson(__filename)
 * console.log(`package.json found at ${pj}`)
 * ```
 */
export const findPackageJson = (from: string | URL, pathFromSrc = '../package.json'): string => {
  const f = typeof from === 'object' || from.startsWith('file://') ? fileURLToPath(from) : from;
  const __dirname = path.dirname(f);

  const nms = __dirname.lastIndexOf(NM);
  if (nms === -1) {
    // see if we are in a dist folder.
    const d = __dirname.lastIndexOf(DIST);
    return d === -1 ? path.resolve(__dirname, pathFromSrc) : path.resolve(__dirname.slice(0, Math.max(0, d)), 'package.json');
  } else {
    // inside of node_modules. find the dist directly under package name.
    const nm = __dirname.slice(0, Math.max(0, nms + NM.length));
    const pkgDir = __dirname.slice(Math.max(0, nms + NM.length));
    // affordance for yarn berry, which puts package contents in
    // '.../node_modules/.store/${id}-${hash}/package/...'
    if (pkgDir.startsWith(STORE)) {
      const pkg = pkgDir.indexOf(PKG, STORE.length);
      if (pkg) {
        return path.resolve(nm, pkgDir.slice(0, Math.max(0, pkg + PKG.length)), 'package.json');
      }
    }
    const pkgName = pkgDir.startsWith('@') ? pkgDir.split(path.sep, 2).join(path.sep) : String(pkgDir.split(path.sep)[0]);
    return path.resolve(nm, pkgName, 'package.json');
  }
};

/**
 * Load the package.json file, either from a TypeScript file somewhere not
 * in a 'dist' folder, or a built and/or installed 'dist' folder.
 *
 * Note: this *only* works if you build your code into `'./dist'`, and that the
 * source path does not also contain `'dist'`! If you don't build into
 * `'./dist'`, or if you have files at `./src/dist/dist.ts`, then this will
 * not work properly!
 *
 * The default `pathFromSrc` option assumes that the calling code lives one
 * folder below the root of the package. Otherwise, it must be specified.
 *
 * Example:
 *
 * ```ts
 * // src/index.ts
 * import { loadPackageJson } from 'package-json-from-dist'
 *
 * const pj = loadPackageJson(import.meta.url)
 * console.log(`Hello from ${pj.name}@${pj.version}`)
 * ```
 *
 * If the caller is deeper within the project source, then you must provide
 * the appropriate fallback path:
 *
 * ```ts
 * // src/components/something.ts
 * import { loadPackageJson } from 'package-json-from-dist'
 *
 * const pj = loadPackageJson(import.meta.url, '../../package.json')
 * console.log(`Hello from ${pj.name}@${pj.version}`)
 * ```
 *
 * When running from CommmonJS, use `__filename` instead of `import.meta.url`
 *
 * ```ts
 * // src/index.cts
 * import { loadPackageJson } from 'package-json-from-dist'
 *
 * const pj = loadPackageJson(__filename)
 * console.log(`Hello from ${pj.name}@${pj.version}`)
 * ```
 */
export const loadPackageJson = async (from: string | URL, pathFromSrc = '../package.json') => {
  const buf = await fs.readFile(findPackageJson(from, pathFromSrc));
  return JSON.parse(buf.toString('utf8')) as unknown;
};
