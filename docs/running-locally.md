## Use Codespaces (preferred- work in progress)

This repo is configured to run a production-like environment in a GitHub [Codespace](https://github.com/features/codespaces).

1. Generate a [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with the read:packages permission
2. Add the following to your [Codespace secrets](https://github.com/settings/codespaces):

_For each secret, select only the lighthouse-embark repository under **Repository Access**._

```env
DEV_CONTAINER_REGISTRY_SERVER = ghcr.io
DEV_CONTAINER_REGISTRY_USER = <GitHub username>
DEV_CONTAINER_REGISTRY_PASSWORD = <personal access token>
```

3. Create a [Codespace](https://docs.github.com/en/codespaces) for the [lighthouse-embark](https://github.com/department-of-veterans-affairs/lighthouse-embark) repo. This option is available by clicking the green **Code** button.
4. Run application:

```bash
yarn dev
```

### Create a Codespace

You can create a new codespace by visiting the [lighthouse-embark repo](https://github.com/department-of-veterans-affairs/lighthouse-embark) and by following the listed steps.

### Prerequisites

- Install [Visual Studio Code](https://code.visualstudio.com/)
- Install the Codespaces [extension](https://marketplace.visualstudio.com/items?itemName=GitHub.codespaces) into Visual Studio Code

_Note: The in-browser VS Code doesn't work properly with this project._

1. Click the `<>` green button near the search and "+" buttons.
2. A dropdown should open up with two tabs, one for "Local" and one for "Codespaces", click "Codespaces".
3. Click "New codespace" and then click "Create codespace".
4. You'll be taken to a new window that sets up the codespace. Click the "Open this codespace in VS Code Desktop" button.
5. Otherwise, click the 3 horizontal lines icon in the upper left sidebar and click "Open in VS Code". You can refresh the page if you don't see this icon.

## Install and run locally with Docker

Running lighthouse-embark locally with Docker can be a great way to work on the app if you don't want to use `Codespaces`. Building the application using `docker-compose` will take a few minutes, but having more control over the application can be nice.

### Prerequisites

- Install git
- Install Docker Desktop: [Mac](https://docs.docker.com/docker-for-mac/install/), [Windows](https://docs.docker.com/docker-for-windows/install/)

### Running the app

1. Run `docker-compose` using the `local-docker-compose.yml` configuration file.

```bash
docker compose -f .localdevcontainer/local-docker-compose.yml up --build
```

2. After the application runs for the first time, copy `node_modules`. It'll need to be run in a separate terminal:

```bash
docker cp app:/code/node_modules ./
```

**Caveats**

- _What does this do_: This will install the application and its dependencies and then run the backend and frontend in separate containers. To ensure fast hot-reloading, `node_modules` and `postgreSQL db` are stored in a docker [volume](https://docs.docker.com/storage/volumes/) and your local source files are mounted into the container.
- _Why do you need to copy after the first run_: The application uses `node_modules` from Docker volume not your local files. Copy these locally so that dependencies resolve correctly in your editor.

**Environment Variable Injection**

The local dev environment is setup to use [chamber](https://github.com/segmentio/chamber) for environment variable injection. A few changes need to be made before this will work.

First you'll need to add a `.env` file within the `.localdevcontainer` folder. An `example.env` is available to copy from. Then, you need to uncomment the `ENTRYPOINT` located at the bottom of the local-Dockerfile, and comment `ENTRYPOINT [ "/entrypoint.sh" ]`. Running `sh local.sh.start` should now inject any environment variables stored within the SSM Parameter Store based on the values within `.env`. It'll grab any variables that start with `lighthouse-embark`.

## Install and run locally

It's possible to run the application locally without docker, however there is a lot of configuration required. You'll also need to run your own database for the app to connect to. This method is the least preferred.

### Prerequisites

- Use [nvm](https://github.com/nvm-sh/nvm) to install node
- Install git
- Install postgresql and create a database called `backstage_plugin_catalog`

- You will need to update the Backstage [configuration](https://backstage.io/docs/conf/#docsNav) for running locally. Update these instructions if you try this out.

### Running the app

1. Start postgres and ensure it's running on the port specified within the configuration file. (Usually 5432) In addition, you'll need to create a new database, `backstage_plugin_catalog` with a user/password matching the configuration file. (Usually postgres for both)
2. Run `yarn install` to install all necessary dependencies.
3. Run `yarn dev` to start the frontend/backend simultaneously.

Note: Pay attention to the logs, as they do a pretty good job at letting you know why something failed.

- `app-config.yaml` is used for Codespaces and it is merged with `app-config.production.yaml` in production environments. Supporting Codespaces is the priority so consider that when changing the way configurations are organized.
