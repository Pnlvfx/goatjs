import type { VpsConfig } from './src/config.js';

// this is just an usage example

export default {
  host: '',
  plugins: [],
  gcpCredentialsPath: '',
  nginx: { serverName: '', port: 8080 },
} satisfies VpsConfig;
