import type { PluginContext } from '../types/plugin.ts';
import path from 'node:path';

// TODO [2026-05-01] change the google-crednetials path to be inside /credentials

export const gcloud = async ({ ssh, gcpCredentialsPath }: PluginContext) => {
  // gcloud
  await ssh.execCommand('sudo apt-get install apt-transport-https ca-certificates gnupg curl');
  await ssh.execCommand('curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/cloud.google.gpg');
  await ssh.execCommand(
    'echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list',
  );
  await ssh.execCommand('sudo apt-get update && sudo apt-get install -y google-cloud-cli');

  // gcloud credentials
  await ssh.putFile(gcpCredentialsPath, path.join('/root', 'google-credentials.json'));

  // gcloud login
  await ssh.execCommand('gcloud auth activate-service-account --key-file=/root/google-credentials.json');
};
