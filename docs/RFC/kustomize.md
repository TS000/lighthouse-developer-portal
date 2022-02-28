# Deploying to Development Environment

## Setup

### Kubectl Install

> If you don't have `kubectl` you'll need to install it:

- Install on [Linux](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
- Install on [Mac](https://kubernetes.io/docs/tasks/tools/install-kubectl-macos/)
- Install on [Windows](https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/)

### Kustomize Install

> If you don't have `kustomize` you'll need to install it:

- Documentation for [installing kustomize](https://kubectl.docs.kubernetes.io/installation/kustomize/)

## Building Images

- Navigate to Root Directory

```
$ cd /workspaces/lighthouse-backstage
```

- Install Dependencies & Run Typescript Compiler

```
$ yarn install --frozen-lockfile && yarn tsc
```

- Verify app-config.dev.yaml has the correct values


```
# app-config.dev.yaml
app:
  title: Lighthouse Developer Portal
  baseUrl: https://dev.devportal.name
...

backend:
  baseUrl: https://dev.devportal.name
  listen:
    port: 7007
  csp:
    connect-src: ["'self'", 'http:', 'https:']
  cors:
    origin: https://dev.devportal.name
    methods: [GET, POST, PUT, DELETE]
    credentials: true
  cache:
    # TODO: update to use memcache in production  https://backstage.io/docs/overview/architecture-overview#cache
    store: memory
  database:
    client: pg
    connection:
      host: ${DEV_POSTGRES_SERVICE_HOST}
      port: ${DEV_POSTGRES_SERVICE_PORT}
      user: ${POSTGRES_USER}
      password: ${POSTGRES_PASSWORD}

...
auth:
  environment: development
  providers:
    github:
      development:
        clientId: ${GH_CLIENT_ID}
        clientSecret: ${GH_CLIENT_SECRET}
```

- Build Static Assets

```
$ yarn build
```

- Determine commit sha you want to tag images with
  - Replace `<commit-sha>` below with the commit sha
  - The commit sha used to tag images is prefixed with "sha-" (i.e. sha-47915d626f95e5b620636376c8adf29ec734...)

- Create Image for Backend Container

```
$ docker build --tag ghcr.io/ghcr.io/department-of-veterans-affairs/lighthouse-backstage/backend:<commit-sha> --tag ghcr.io/department-of-veterans-affairs/lighthouse-backstage/backend:latest -f Dockerfile.backend .
```

- Create Image for Frontend Container

```
$ docker build --tag ghcr.io/ghcr.io/department-of-veterans-affairs/lighthouse-backstage/frontend:<commit-sha> --tag ghcr.io/department-of-veterans-affairs/lighthouse-backstage/frontend:latest -f Dockerfile.frontend .
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

> Note: if using Codespaces then you cannot install Lightkeeper. To work around this, you can set your kube config locally using the steps above and then copy the config to your Codespaces. In Codespaces, you can make a new `.kube` directory in `~/` and then make a new file inside `~/.kube/` called `config`. Inside `~/.kube/config` you can copy the contents of your local `~/.lightkeeper/config` file.

### Setting Up Environment Variables

> Note: To pull the image, Kubernetes will need authorization for GitHub. One way to verify you have authorization is to create an encoded dockerconfigjson secret using a Personal Access Token. The encoded dockerconfigjson string will be used to create a built in Kubernetes secret type called `kubernetes.io/dockerconfigjson`. More information about creating and encoding the [dockerconfigjson string](https://kubernetes.io/docs/tasks/configure-pod-container/pull-image-private-registry/)

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

  - Create `.env` file with your environment variables; you will need to set all of these variables in order for the deployment to work.

  ```
  DOCKERCONFIGJSON=<base64 encoded json string>
  GH_TOKEN=<github_token>
  GH_CLIENT_ID=<GH OAuth Client ID>
  GH_CLIENT_SECRET=<GH OAuth Client Secret>
  HOST=dev.devportal.name
  BASE_URL=https://dev.devportal.name
  GATEWAY=istio-system/dev-devportal-name-gateway
  NONPROD=true
  DEPLOY_ENV=dev
  COMMIT_SHA=<commit sha used to tag image or "latest"*>
  ```
  >* If you manually build, push, and tag the image with "latest", using "latest" as the image tag for the deployment can work as a temporary fix but it is preferable to use something more unique like a commit sha. The "latest" tag changes frequently due to the CI workflow so this may cause the containers to crash by pulling an image definition that deployment may not be configured to use.

  - Export file contents

  ```
  set -o allexport; source .env; set +o allexport
  ```

### Generate Kubernetes Resources with Kustomize

- Once the `.env` file is created move it to the `deployment/scripts` directory

```
$ cp .env deployments/scripts/
```

- Create the environment specific resource files for the deployment using the `env-config-secrets.sh` file

```
$ chmod +x deployment/scripts/env-config-secrets.sh
$ ./env-config-secrets.sh
```

> This script will create a new directory called `overlays` containing the `dev` directory. Inside the `dev` directory will be the kustomiation file, configmaps, secrets, and any patch files using the appropriate environment variables. This overlay will combine with the base kustomize files to create the deployment.

- Deploy the application by running the `kustomize build` to output the generated files as an input for the `kubectl apply` command:

```
$ kustomize build deployment/overlays/dev | kubectl apply -f -
```
### Verify Deployment

- Through Terminal

```
$ kubectl get deployments -n lighthouse-bandicoot-dev
NAME                             READY   UP-TO-DATE   AVAILABLE   AGE
dev-backend                       1/1     1            1           9m59s
dev-frontend                      1/1     1            1           9m59s
dev-postgres                      1/1     1            1           9m58s
```

- Visit https://dev.devportal.name to view the running application

### Deleting resources
- To manually delete the deployment and all of the resources that were created:
```
$ kustomize build deployment/overlays/dev | kubectl delete -f -
```

> Note: The command above to delete resources only works if all of the resources described in the path provided to `kustomize build` have the same name that they were deployed with. So if you deploy then modify any of the kubernetes resource files in a way that changes the name of a resource not all of the resources will be deleted. You would need to manual find those resources using `kubectl get <resource_type>` and delete with `kubectl delete <resource_type>/<resource_name>`.
