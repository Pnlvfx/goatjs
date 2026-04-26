import type { VpsConfig } from './src/types/config.ts';

export default {
  host: '',
  plugins: [],
  gcpCredentialsPath: '',
  nginx: { serverName: '', port: 8080 },
} satisfies VpsConfig;

// this is just an usage example
