#!/usr/bin/env node

import { rimraf } from '../rimraf.js';

const run = async () => {
  try {
    const args = process.argv.slice(2);
    await rimraf(args);
    process.exit(0);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  }
};

void run();
