# Deploying to Development Environment

## Setup

### Kubectl Install
>If you don't have `kubectl` you'll need to install it:
- Install on [Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
- Install on [Mac](https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/)
- Install on [Windows](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/)

### Helm Install
>If you don't have `helm` you'll need to install it:
- Find the latest release to download and [install helm](https://github.com/helm/helm/releases)

## Building Images
- Navigate to Root Directory
```
$ cd /workspaces/lighthouse-backstage
```
- Install Dependencies & Run Typescript Compiler
```
$ yarn install --frozen-lockfile && yarn tsc
```
- Configure app-config.yaml
- Depending on what environment you're deploying to will determine what you need to set the values for:
  - app.baseUrl
  - backend.baseUrl
  - backend.cors.origin
  - backend.database.connection
    - host, port, user, password
```
# app-config.yaml
app:
  title: DVP Developer Portal
  baseUrl: https://dev.devportal.name
...

backend:
  baseUrl: https://dev.devportal.name
  listen:
    port: 7000
  csp:
    connect-src: ["'self'", 'http:', 'https:']
  cors:
    origin: https://dev.devportal.name
...
  database:
    client: pg
    connection:
      host: ${POSTGRES_SERVICE_HOST}
      port: ${POSTGRES_SERVICE_PORT}
      user: ${POSTGRES_USER}
      password: ${POSTGRES_PASSWORD}
```
- Build Static Assets
```
$ yarn build
```
- Determine version number you want to tag images with
  - Replace `<version-number>` below with the version number
https://github.com/orgs/department-of-veterans-affairs/packages?repo_name=lighthouse-backstage
- Create Image for Backend Container
```
$ docker build --tag ghcr.io/ghcr.io/department-of-veterans-affairs/lighthouse-backstage/backend:<version-number> --tag ghcr.io/department-of-veterans-affairs/lighthouse-backstage/backend:latest -f Dockerfile.backend .
```
- Create Image for Frontend Container
```
$ docker build --tag ghcr.io/ghcr.io/department-of-veterans-affairs/lighthouse-backstage/frontend:<version-number> --tag ghcr.io/department-of-veterans-affairs/lighthouse-backstage/frontend:latest -f Dockerfile.frontend .
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
$ docker push --all-tags ghcr.io/department-of-veterans-affairs/lighthouse-backstage/backend:latest 
```
```
$ docker push --all-tags ghcr.io/department-of-veterans-affairs/lighthouse-backstage/frontend:latest 
```

- Verify the images were pushed by checking when the frontend/backend images were last published on the [Lighthouse-Backstage repository](https://github.com/orgs/department-of-veterans-affairs/packages?repo_name=lighthouse-backstage) 

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
### Install Helm Chart
- Modify `values.yaml` to configure deployment to use nonprod cluster

> Note: To pull the image, Kubernetes will need authorization for GitHub. One way to verify you have authorization is to create an encoded dockerconfigjson secret using a Personal Access Token. The encoded dockerconfigjson string can be passed as an environment variable to Helm. More information about creating and encoding the [dockerconfigjson string](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)

- Create Environment Variables for Secrets
  - Create `.env` file with your environment variables
  ```
  DOCKERCONFIGJSON=<base64 encoded json string>
  GITHUB_TOKEN=<base64 encoded github_token>
  ...
  ```
  - Export file contents
  ```
  set -o allexport; source .env; set +o allexport
  ```

- Install the Helm chart and set secrets using `--set`
```
helm install backstage-dev helm/lighthouse-backstage/ --debug --values helm/lighthouse-backstage/values.yaml --namespace lighthouse-bandicoot-dev --set DOCKERCONFIGJSON=$DOCKERCONFIGJSON --set GITHUB_TOKEN=$GITHUB_TOKEN 
```

### Verify Deployment
- Through Terminal
```
$ helm list -n lighthouse-bandicoot-dev
NAME            NAMESPACE                       REVISION        UPDATED                                 STATUS          CHART                           APP VERSION
backstage-dev   lighthouse-bandicoot-dev        1               2021-10-07 07:37:22.4745171 -0700 PDT   deployed        lighthouse-backstage-0.1.0      1.16.0
```

- Visit https://dev.devportal.name to view the running application