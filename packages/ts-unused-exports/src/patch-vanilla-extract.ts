/* eslint-disable no-console */
/* eslint-disable sonarjs/no-nested-template-literals */
import type { UnusedResponse } from './types.ts';
import path from 'node:path';
import fs from 'node:fs/promises';

/**
 * Filter out Vanilla Extract .css.ts files that are actually being imported as .css
 * This handles the case where ts-unused-exports doesn't understand the .css.ts -> .css mapping
 */
export const patchVanillaCssFiles = async (unused: UnusedResponse): Promise<UnusedResponse> => {
  const result: UnusedResponse = {};

  for (const [filePath, exports] of Object.entries(unused)) {
    // Check if this is a Vanilla Extract CSS file (.css.ts)
    if (filePath.endsWith('.css.ts')) {
      const isUsed = await isVanillaCssFileUsed(filePath);

      if (isUsed) {
        // File is being imported as .css - skip it from unused exports
        console.log(`✓ Vanilla CSS file "${filePath}" is imported as .css - skipping from unused check`);
        continue;
      } else {
        // File is genuinely unused
        console.warn(`✗ Vanilla CSS file "${filePath}" appears to be genuinely unused`);
        result[filePath] = exports;
      }
    } else if (filePath.includes('.css.')) {
      // Handle other CSS-related files (.css.js, etc.) with a warning
      console.warn(`⚠ CSS-related file "${filePath}" detected - manual verification recommended`);
      result[filePath] = exports;
    } else {
      // Not a CSS file - keep in results
      result[filePath] = exports;
    }
  }

  return result;
};

/**
 * Check if a .css.ts file is actually imported via its .css extension
 * Vanilla Extract files are imported as .css but the source is .css.ts
 */
const isVanillaCssFileUsed = async (cssTsFilePath: string): Promise<boolean> => {
  try {
    // Get the .css import path (what consumers actually import)
    const cssImportPath = cssTsFilePath.replace(/\.css\.ts$/, '.css');
    const baseName = path.basename(cssImportPath);

    // Find all TypeScript/JavaScript files in the project
    const projectRoot = path.resolve('.');
    const sourceFiles: string[] = [];

    // Use fs.glob to find all source files
    const patterns = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.mts', '**/*.cts'];
    for (const pattern of patterns) {
      for await (const file of fs.glob(pattern, {
        cwd: projectRoot,
        exclude: (name) => name.includes('node_modules') || name.includes('dist') || name.includes('build') || name.includes('.next'),
      })) {
        sourceFiles.push(path.resolve(projectRoot, file));
      }
    }

    // Search for imports of this CSS file
    for (const sourceFile of sourceFiles) {
      // Skip the .css.ts file itself
      if (sourceFile === path.resolve(cssTsFilePath)) continue;

      try {
        const content = await fs.readFile(sourceFile, 'utf8');

        // Check for various import patterns:
        // import styles from './file.css'
        // import './file.css'
        // import { class1, class2 } from './file.css'
        // require('./file.css')
        const importPatterns = [
          // ES6 imports with relative path
          new RegExp(String.raw`from\s+['"]\.\.?/.*?${baseName.replace('.', String.raw`\.`)}['"]`, 'g'),
          // ES6 imports with absolute path (e.g., from package)
          new RegExp(String.raw`from\s+['"][^'"]*${baseName.replace('.', String.raw`\.`)}['"]`, 'g'),
          // require statements
          new RegExp(String.raw`require\s*\(\s*['"][^'"]*${baseName.replace('.', String.raw`\.`)}['"]\s*\)`, 'g'),
          // Side-effect imports
          new RegExp(String.raw`^\s*import\s+['"][^'"]*${baseName.replace('.', String.raw`\.`)}['"]`, 'gm'),
        ];

        for (const pattern of importPatterns) {
          if (pattern.test(content)) {
            return true;
          }
        }
      } catch (err) {
        console.error(err);
        continue;
      }
    }

    return false;
  } catch (err) {
    console.error(`Error checking vanilla CSS usage for ${cssTsFilePath}:`, err);
    return false;
  }
};
