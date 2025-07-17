#!/usr/bin/env node

import { rimraf } from '../rimraf.js';

const run = async () => {
  const args = process.argv.slice(2);
  await rimraf(args);
};

void run();
