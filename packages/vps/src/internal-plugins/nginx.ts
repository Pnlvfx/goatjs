import type { NginxConfig } from '../types/nginx.ts';
import type { PluginContext } from '../types/plugin.ts';

export const nginx = async ({ ssh, nginx: { serverName, port } }: PluginContext) => {
  await ssh.execCommand('sudo apt install -y nginx');
  const nginxConfig = createNginxConfig({ port, serverName });
  await ssh.execCommand(`sudo bash -c 'cat > /etc/nginx/sites-available/${serverName}.conf << "EOF"
${nginxConfig}
EOF'`);
  await ssh.execCommand(`sudo ln -s /etc/nginx/sites-available/${serverName}.conf /etc/nginx/sites-enabled/${serverName}.conf`);
  await ssh.execCommand('sudo systemctl start nginx');

  // Test Nginx configuration
  await ssh.execCommand('sudo nginx -t');
};

export const createNginxConfig = ({ port, serverName }: NginxConfig) => {
  return `server {
    server_name ${serverName};
    location / {
        proxy_pass http://localhost:${port.toString()};
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}`;
};
