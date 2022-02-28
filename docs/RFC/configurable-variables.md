# [RFC] Configurable Variables

**Summary**:

As a requirement for our continuous integration process, we need to deploy the Lighthouse developer portal application to multiple environments without rebuilding images for each environment. The purpose of this RFC is to identify the set of configurable variables that can be managed independently of the deployment definition.

## Background

Backstage uses a flexible configuration system designed to provide an simple way to configure Backstage applications for local or production environments. Configuration can be supplied through static configuration files, such as `app-config.yaml` for default configurations, and other files can be loaded by using `--config <path>` when using `backstage-cli` to build either `app` or `backend`.

During the continuous integration pipeline, GitHub Actions create build assets for the Lighthouse Developer Portal application using `backstage-cli`. Those build assets are then used to create two Docker images: one frontend image and one backend image. These images are used to create separate containers where the frontend and backend applications can run.

Since the application images are created using `backstage-cli`, which loads the configuration from `app-config.yaml`, variables must be used as configuration values in the `app-config.yaml` to allow changes to the application configuration without rebuilding the application image.

## Goal

We want to leverage Backstage's application configuration system to streamline our continuous integration process so the Lighthouse Developer Portal application can be deployed to multiple environments using a single build process. To take advantage of Backstage's application configuration system we need to identify all of the configuration variables required to deploy the Lighthouse developer portal.


## Findings

### Building the application

There are two scripts located in `package.json` that are used to build the frontend and backend assets:

- `"build backend": "yarn workspace @department-of-veterans-affairs/backend backstage-cli backend:bundle"`
This script builds the backend bundle and copies the output to `packages/backend/dist`.

- `"build frontend": "cp app-config.yaml app-config.dev.yaml packages/app/ && yarn workspace @department-of-veterans-affairs/app backstage-cli app:build --config app-config.yaml --config app-config.dev.yaml"`
This script using the `--config` flag to specify what application configuration files are loaded. The default configuration is contained in `app-config.yaml`. The `app-config.dev.yaml` contains the configuration to deploy the application to `https://dev.devportal.name`.


From [Backstage Documentation:](https://backstage.io/docs/conf/writing#configuration-files)
>All loaded configuration files are merged together using the following rules:
>- Configurations have different priority, higher priority means you replace values from configurations with lower priority.
>- Primitive values are completely replaced, as are arrays and all of their contents.
>- Objects are merged together deeply, meaning that if any of the included configs contain a value for a given path, it will be found.

>The priority of the configurations is determined by the following rules, in order:
>- Configuration from the APP_CONFIG_ environment variables has the highest priority, followed by files.
>- Files loaded with config flags are ordered by priority, where the last flag has the highest priority.
>- If no config flags are provided, app-config.local.yaml has higher priority than app-config.yaml.


### Application Environment Variables

`GH_TOKEN`: GitHub Token used by the application for making API requests to GitHub

`GH_CLIENT_ID`: GitHub OAuth Client ID

`GH_CLIENT_SECRET`:  GitHub OAuth Client Secret

**The following are not currently implemented:**

`POSTGRES_HOST`: Host URL used for Postgres Database connection

`POSTGRES_PORT`: Port used for Postgres Database connection

`POSTGRES_USER`: Username for Postgres Database authentication

`POSTGRES_PASSWORD`: Password for Postgres Database authentication


### Environment Variable Overrides
Backstage's [documentation](https://backstage.io/docs/conf/writing#environment-variable-overrides) outlines how to override environment variables using the prefix `APP_CONFIG` and replacing `.` with `-` (i.e. `app.baseUrl` becomes `APP_CONFIG_app_baseUrl`). Since the `baseUrl` must be statically defined, the value can be provided within the `app-config.production.yaml` but overridden for staging or testing environments.

## Recommendation
We can replace `app-config.dev.yaml` with `app-config.production.yaml`. In the `app-config.production.yaml` we would statically define the baseUrl used for our application in production. The application configuration would consist of the default `app-config.yaml` and the `app-config.production.yaml` for the build process.

To deploy to dev, sandbox, qa, or any other intermediary environment we would use environment variable overrides to override the values of `app.baseUrl`, `backend.baseUrl.`, and `backend.cors.connection`. These value overrides could be provided to each container using a ConfigMap with Helm providing the values passed through the command line interface.


