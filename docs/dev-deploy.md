# Deploying to Development Environment
This document outlines the manual deployment process to the Development Environment provided by the DI team. Currently the Lighthouse-Embark repository is configured to automatically deploy to the Development Environment on all `push` events with the `main` branch using [GitHub actions](https://github.com/department-of-veterans-affairs/lighthouse-embark/blob/main/.github/workflows/cicd.yml).


## Setup

### Kubectl Install

> If you don't have `kubectl` you'll need to install it:

- Install on [Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
- Install on [Mac](https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/)
- Install on [Windows](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/)

### Helm Install

> If you don't have `helm` you'll need to install it:

- Find the latest release to download and [install helm](https://github.com/helm/helm/releases)

## Building Images

- Navigate to Root Directory

```
$ cd /workspaces/lighthouse-embark
```

- Install Dependencies & Run Typescript Compiler

```
$ yarn install --frozen-lockfile && yarn tsc
```

- Verify app-config.dev.yaml has the correct values

```
# app-config.dev.yaml
app:
  title: Embark Developer Portal
  baseUrl: <host_url>
...

backend:
  baseUrl: <host_url>
  listen:
    port: 7007
  csp:
    connect-src: ["'self'", 'http:', 'https:']
  cors:
    origin: <host_url>
    methods: [GET, POST, PUT, DELETE]
    credentials: true
  cache:
    store: memory
  database:
    client: sqlite3
    connection: ':memory:'
...
auth:
  environment: development
  providers:
    github:
      development:
        clientId: ${GH_CLIENT_ID}
        clientSecret: ${GH_CLIENT_SECRET}
```

> Refer to [DI Routing Traffic Guide](https://github.com/department-of-veterans-affairs/lighthouse-di-platform-servicemesh/blob/main/docs/routing-traffic.md) for most recent information related to the `host_url` referenced above.

> Note: You can opt to use environment variables instead of modifying the `app-config.yaml` and rebuilding the image. The `baseUrl` can be overridden using environment variables prefixed with `APP_CONFIG` (e.g. `APP_CONFIG_app_baseUrl` ). Here is an example of a [ConfigMap](https://github.com/department-of-veterans-affairs/embark-deployment/blob/main/dist/dev/dev.yaml#L2) in our deployment repository. This will generally work for most fields in the `app-config.yaml`, but the `baseUrl` specifically has been known to break the OAuth by generating invalid callback URLs by using the `baseUrl` from the `app-config.yaml` instead of the environmental overrides. 


- Build Static Assets

```
$ yarn build
```

- Determine commit sha you want to tag images with

  - Replace `<commit-sha>` below with the commit sha
  - The commit sha used to tag images is prefixed with "sha-" (e.g. .../backend:sha-47915d626f95e5b620636376c8adf29ec734...)

- Create Image for Backend Container

```
$ docker build --tag ghcr.io/ghcr.io/department-of-veterans-affairs/lighthouse-embark/backend:<commit-sha> --tag ghcr.io/department-of-veterans-affairs/lighthouse-embark/backend:latest -f Dockerfile.backend .
```

- Create Image for Frontend Container

```
$ docker build --tag ghcr.io/ghcr.io/department-of-veterans-affairs/lighthouse-embark/frontend:<commit-sha> --tag ghcr.io/department-of-veterans-affairs/lighthouse-embark/frontend:latest -f Dockerfile.frontend .
```

## Push Images to GitHub Packages

- Login to [ghcr.io with PAT](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

  - Create environment variable with your PAT

  ```
  $ export CR_PAT=<YOUR_TOKEN>
  ```

  - Login to ghcr.io with your GitHub username

  ```
  $ echo $CR_PAT | docker login ghcr.io -u <USERNAME> --password-stdin
  > Login Succeeded
  ```

- Push the Images to the Container Registry

```
$ docker push --all-tags ghcr.io/department-of-veterans-affairs/lighthouse-embark/backend:latest
```

```
$ docker push --all-tags ghcr.io/department-of-veterans-affairs/lighthouse-embark/frontend:latest
```

- Verify the images were pushed by checking when the frontend/backend images were last published on the [lighthouse-embark repository](https://github.com/orgs/department-of-veterans-affairs/packages?repo_name=lighthouse-embark)

## Deploy to Dev Environment

### Login to Lightkeeper

- Login to Lightkeeper

```
$ lightkeeper login
Go here to complete your login: https://...
Login Successful!
```

- Set up kube config

```
$ lightkeeper create clusterconfig nonprod > ~/.kube/config
```
> Note: Lightkeeper cli must be used on GFE or CAG desktop.

### Install Helm Chart

- Modify `values.yaml` to configure deployment to use nonprod cluster

> Note: To pull the image, Kubernetes will need authorization for GitHub. One way to verify you have authorization is to create an encoded dockerconfigjson secret using a Personal Access Token. The encoded dockerconfigjson string can be passed as an environment variable to Helm. More information about creating and encoding the [dockerconfigjson string](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)

- Creating a DOCKERCONFIGJSON string

  - First make a PAT with the permission to `read` access for repositories

  ```
  $ echo -n "<github_username>:<github_pat>" | base64
  ```

  - The above command will create an <encoded_auth_string>, with the encoded auth string run:

  ```
  $ echo -n  '{"auths":{"ghcr.io":{"auth":"<encoded_auth_string>"}}}' | base64
  ```

  - This will output the <encoded_dockerjsonconfig_string> which you can then add to the `.env` file:

  ```
  DOCKERCONFIGJSON=<encoded_dockerjsonconfig_string>
  ```

- Create Environment Variables for Secrets

  - Create `.env` file with your environment variables; you will need to set all of these variables in order for the deployment to work. You can reference this [ConfigMap](https://github.com/department-of-veterans-affairs/lighthouse-embark/blob/main/helm/embark/templates/configmap.yaml) used by the helm deployment to ensure all environment variables are configured.

  ```
  DOCKERCONFIGJSON=<base64 encoded json string>
  GH_TOKEN=<github_token>
  GH_CLIENT_ID=<GH OAuth Client ID>
  GH_CLIENT_SECRET=<GH OAuth Client Secret>
  HOST=<host_url>
  BASE_URL=http://<host_url>
  GATEWAY=<gateway>
  NONPROD=true
  DEPLOY_ENV=dev
  COMMIT_SHA=<commit sha used to tag image or "latest"*>
  ```

  > Refer to [DI Routing Traffic Guide](https://github.com/department-of-veterans-affairs/lighthouse-di-platform-servicemesh/blob/main/docs/routing-traffic.md) for most recent information related to the `host_url` referenced above.

  > If you manually build, push, and tag the image with "latest", using "latest" as the image tag for the deployment can work as a temporary fix but it is preferable to use something more unique like the commit sha. The "latest" tag changes frequently due to the CI workflow so this may cause the containers to crash by pulling an image definition that the Helm release may not be configured to use.

  - Export file contents

  ```
  set -o allexport; source .env; set +o allexport
  ```

- Install the Helm chart and set secrets using `--set`

```
$ helm upgrade embark-dev helm/embark/ --debug --values helm/embark/values.yaml --namespace lighthouse-bandicoot-dev --set DOCKERCONFIGJSON=$DOCKERCONFIGJSON --set BACKEND_SECRET=$BACKEND_SECRET --set HOST=$HOST --set GATEWAY=$GATEWAY --set GH_CLIENT_ID=$GHA_CLIENT_ID --set GH_CLIENT_SECRET=$GHA_CLIENT_SECRET --set nonprod=$NONPROD --set BASE_URL=$BASE_URL --set global.DEPLOY_ENV=$DEPLOY_ENV --set global.image.tag=$COMMIT_SHA --set POSTGRES_USER=$POSTGRES_USER --set POSTGRES_PASSWORD=$POSTGRES_PASSWORD --set AWS_BUCKET_NAME=$AWS_BUCKET_NAME --set global.SERVICE_ACCOUNT=$SERVICE_ACCOUNT --set DOCSERVER_BASE_URL=$DOCSERVER_BASE_URL --install --atomic --cleanup-on-fail --history-max 5
```

### Verify Deployment

- Through Terminal

```
$ helm list -n lighthouse-bandicoot-dev
NAME            NAMESPACE                       REVISION        UPDATED                                 STATUS          CHART                           APP VERSION
embark-dev       lighthouse-bandicoot-dev        15              2021-12-08 18:11:06.6508301 -0800 PST   deployed        embark-0.1.0                    1.16.0
```

- Browser
Using a CAG browser or GFE, enter the `<host_url>` used above to access the Embark application.


