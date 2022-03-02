## Use Codespaces (preferred- work in progress)

This repo is configured to run a production-like environment in a GitHub [Codespace](https://github.com/features/codespaces).

1. Generate a [personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) with the read:packages permission
2. Add the following to your [Codespace secrets](https://github.com/settings/codespaces):

_For each secret, select only the lighthouse-developer-portal repository under **Repository Access**._

```env
DEV_CONTAINER_REGISTRY_SERVER = ghcr.io
DEV_CONTAINER_REGISTRY_USER = <GitHub username>
DEV_CONTAINER_REGISTRY_PASSWORD = <personal access token>
```

3. Create a [Codespace](https://docs.github.com/en/codespaces) for the [lighthouse-developer-portal](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal) repo. This option is available by clicking the green **Code** button.
4. Run application:

```bash
yarn dev
```

### Create a Codespace

You can create a new codespace by visiting the [lighthouse-developer-portal repo](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal) and by following the listed steps.

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

Running lighthouse-developer-portal locally with Docker can be a great way to work on the app if you don't want to use `Codespaces`. Building the application using `docker-compose` will take a few minutes, but having more control over the application can be nice.

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

## Install and run locally

It's possible to run the application locally without docker, however there is a lot of configuration required. You'll also need to run your own database for the app to connect to. This method is the least preferred.

### Prerequisites

- Use [nvm](https://github.com/nvm-sh/nvm) to install node
- Install git
- Install postgresql and create a database called `backstage_plugin_catalog`
    - `docker pull postgres`
    - `docker run -it --rm --name embark -p 5432:5432  -e POSTGRES_PASSWORD=postgres -d postgre`
    - `docker ps`
    - Copy the container id
    - `docker exec -it <container id> bash`
    - Connect to postgres database
    - `psql -U postgres`
    - Create database called `backstage_plugin_catalog`
    - `create database backstage_plugin_catalog`
    - View databases
    - `\l`
    - You should see the `backstage_plugin_catalog` database
    - Exit database
    - `\q` then `exit`

- You will need to update the Backstage [configuration](https://backstage.io/docs/conf/#docsNav) for running locally. Update these instructions if you try this out.
- You will need to make local env variables that are used in the app-config.yaml file
    - `BACKEND_SECRET`
    - `GH_CLIENT_SECRET`
    - `DOCSERVER_BASE_URL` - Needs to be a string
    - `GH_CLIENT_ID`
    - `POSTGRES_HOST` - Needs to be string
    - `GH_TOKEN`
- To get the values for the env variables, open the backstage app in a codespace and type `env` or `export`. You will see a list of env variables and their values. Copy the values to your local environment and create the env variables with the export command:
    - `export VAR=abc` use quotes for string values

Now start backstage with `yarn dev` and you should be able to run the application as well as have access techdocs locally

### Running the app

1. Start postgres and ensure it's running on the port specified within the configuration file. (Usually 5432) In addition, you'll need to create a new database, `backstage_plugin_catalog` with a user/password matching the configuration file. (Usually postgres for both)
2. Run `yarn install` to install all necessary dependencies.
3. Run `yarn dev` to start the frontend/backend simultaneously.

Note: Pay attention to the logs, as they do a pretty good job at letting you know why something failed.

- `app-config.yaml` is used for Codespaces and it is merged with `app-config.production.yaml` in production environments. Supporting Codespaces is the priority so consider that when changing the way configurations are organized.
