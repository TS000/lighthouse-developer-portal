## Open a Codespace (preferred- work in progress)

This repo is configured to run a production-like environment in a GitHub [Codespace](https://github.com/features/codespaces).

1. Open a Codespace
2. Run application:

```
yarn dev
```

## Install and run locally with Docker (work in progress)

**Prerequisites**

- Install git
- Install Docker Desktop: [Mac](https://docs.docker.com/docker-for-mac/install/), [Windows](https://docs.docker.com/docker-for-windows/install/)

1. Run

```
sh local.sh start
```

2. After the application runs for the first time, copy `node_modules`. While the application is running, run this is a separate terminal:

```
sh local.sh copy
```

**Caveats**

- _What does this do_: This will install the application and its dependencies and then run the backend and frontend in separate containers. To ensure fast hot-reloading, `node_modules` and `postgreSQL db` are stored in a docker [volume](https://docs.docker.com/storage/volumes/) and your local source files are mounted into the container.
- _Why do you need to copy after the first run_: The application uses `node_modules` from Docker volume not your local files. Copy these locally so that dependencies resolve correctly in your editor.

**Environment Variable Injection**

The local dev environment is setup to use [chamber](https://github.com/segmentio/chamber) for environment variable injection. A few changes need to be made before this will work.

First you'll need to add a `.env` file within the `.localdevcontainer` folder. An `example.env` is available to copy from. Then, you need to uncomment the `ENTRYPOINT` located at the bottom of the local-Dockerfile, and comment `ENTRYPOINT [ "/entrypoint.sh" ]`. Running `sh local.sh.start` should now inject any environment variables stored within the SSM Parameter Store based on the values within `.env`. It'll grab any variables that start with `lighthouse-backstage`.

## Install and run locally (TBD)

- Use [nvm](https://github.com/nvm-sh/nvm) to install node
- You will need to update the Backstage [configuration](https://backstage.io/docs/conf/#docsNav) for running locally. Update these instructions if you try this out.
- `app-config.yaml` is used for Codespaces and it is merged with `app-config.production.yaml` in production environments. Supporting Codespaces is the priorty so consider that when changing the way configurations are organized.
