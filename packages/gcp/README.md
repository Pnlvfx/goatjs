# @goatjs/gcp

Utilities for deploying applications to Google Cloud Platform (GCP).

## Installation

```bash
npm install --save-dev @goatjs/gcp
```

## Requirements

- Google Cloud SDK (`gcloud`) installed and authenticated
- GCP project configured

## Exports

### `gcp`

Main GCP deployment object.

```typescript
export const gcp: {
  appEngine: {
    deploy: (projectName: string) => Promise<void>;
  };
};
```

#### `gcp.appEngine.deploy`

Deploys the application to Google App Engine.

**Signature:**

```typescript
deploy: (projectName: string) => Promise<void>;
```

**Parameters:**

- `projectName` (string): The GCP project ID

**Example:**

```typescript
import { gcp } from '@goatjs/gcp';

// Deploy to App Engine
await gcp.appEngine.deploy('my-gcp-project-id');
```

**Deployment Process:**

1. Checks git status for uncommitted changes
2. Cleans the `dist` directory
3. Runs `yarn build`
4. Runs pre-deploy optimizations (removes devDependencies)
5. Configures gcloud project
6. Deploys using `gcloud app deploy`
7. Resets project state (restores package.json)
8. Bumps version with `yarn version minor`
9. Commits and pushes changes

## Features

- **Automated Build**: Runs build before deployment
- **Git Integration**: Ensures clean working directory
- **Bundle Optimization**: Removes devDependencies before deploy
- **Automatic Versioning**: Bumps version on successful deploy
- **Safe Rollback**: Restores project state on failure

## Environment Setup

Before using this package, ensure:

1. **Install gcloud CLI**:

   ```bash
   # macOS
   brew install --cask google-cloud-sdk

   # Windows
   choco install gcloudsdk

   # Linux
   curl https://sdk.cloud.google.com | bash
   ```

2. **Authenticate**:

   ```bash
   gcloud auth login
   gcloud config set project YOUR_PROJECT_ID
   ```

3. **Enable App Engine API**:
   ```bash
   gcloud services enable appengine.googleapis.com
   ```

## Configuration

Ensure your project has an `app.yaml` file for App Engine configuration:

```yaml
runtime: nodejs20

env_variables:
  NODE_ENV: production

automatic_scaling:
  min_instances: 1
  max_instances: 10
```

## Dependencies

- `@goatjs/dbz`
- `@goatjs/node`
- `@goatjs/rimraf`
