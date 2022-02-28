# 12-Factor App Checklist

|                   |     |                |       |
| ----------------- | --- | -------------- | ----- |
| Decision Made:    | yes | Decision Date: | 11/21 |
| Revisit Decision: | no  | Date           | 12/15 |

**Revisit criteria:**

Decision Made: Yes
Revisit Decision: No, but open to taking another look, Revisit Date: November 2022
Revisit Criteria: If a developer is interested in revisiting this.

Decision Makers: @rianfowler, @mhyder1, @keyluck, @KaemonIsland

## tl;dr

This ADR walks through each of the [12 factor app](https://12factor.net/) checklist items. The Lighthouse developer portal does not meet criteria on 3 facets. We will add tickets for these items and revisit this ADR on 12/15

## History

We plan to use [Kubernetes](https://kubernetes.io/) to deploy our application. The [12-factor app](https://12factor.net/) pattern is the _ideal_ type of app to run on Kubernetes.

## 1. Codebase

> One codebase tracked in revision control, many deploys.

- [x] Meets Criteria

- The codebase exists on [GitHub](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/tree/main) and uses Git for version control.
- [GitHub Actions](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/actions) are used to automate tests/builds/deploys along with requiring peer-approval in order to merge a PR.
- The codebase uses `Docker` for building the Frontend and Backend applications.

## 2. Dependencies

> Explicitly declare and isolate dependencies.

- [x] Meets Criteria

- The app [Frontend](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/tree/twelve-factor-app-adr/packages/app) and [Backend](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/tree/twelve-factor-app-adr/packages/backend) can each be run individually and are not reliant on each other.
- The package/plugin items each have their own `package.json` files to list each dependency.
- Each package/plugin uses `semver` to determine individual versions.

## 3. Config

> Store config in the environment.

- [ ] Meets Criteria

- Configuration settings use ENV variables and are not hardcoded.
- Kubernetes can automatically connect to the DB. We are able to update the config, without needing to create a new deploy.

`Steps to Meet Criteria`

- Use ENV to determine Ports.

## 4. Backing Services

> Treat backing services as attached resources.

- [ ] Meets Criteria

- Uses object storage where files are needed, (Stores component entries within the DB)
- Uses external Postgres DB to persist state.
- Uses ENV variables to connect to the DB.

`Steps to Meet Criteria`

- We do not use ENV vars to configure timeouts/endpoints. We should do a spike to add timeouts to processes.

## 5. Build, release, run

> Strictly separate build and run stages.

- [x] Meets Criteria

- The build process is well defined within the [docs](https://department-of-veterans-affairs.github.io/lighthouse-developer-portal/deployment/), and within the GitHub Action.
- We use a `Dockerfile` and `docker-compose.yml` files to define the entrypoint for the frontend and backend.
- Uses tags to determine releases.

## 6. Processes

> Execute the app as one or more stateless processes.

- [x] Meets Criteria

- Backend exposes a [health check](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/blob/main/k8s/backstage.yaml#L26) endpoint.
- Processes do not depend on a process manager.
- Health checks do not depend on the health of backing services, the backend will just report them.
- The backend will respond with exit code 1 if it comes across an error.
- Responds to `SIGTERM` and exits gracefully.

## 7. Port binding

> Export services via port binding.

- [x] Meets Criteria

- The [Frontend Dockerfile](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/blob/main/Dockerfile.frontend#L10) defines `PORT` 3000.
- Each service listens on a preconfigured bind-address port using the `app-config.yml` file.
- Listens on [non-privileged](https://www.w3.org/Daemon/User/Installation/PrivilegedPorts.html) ports. (> 1024)

## 8. Concurrency

> Scale out via the process model.

- [x] Meets Criteria

- The app can be run any number of times in parallel. (Multiple backends or frontends when needed)
- The app uses database transactions.
- App doesn't depend on sticky sessions. Requests can hit any process.

`Steps to Meet Criteria`

- Create Spike to document DB connections, and find out more about pool size.

## 9. Disposability

> Maximize robustness with fast startup and graceful shutdown.

- [x] Meets Criteria

- Does not use local state for processes. Every action, other than feature-flags, uses the DB to persist state.
- Processes can be easily created/destroyed without orchestrated shutdown process. (Able to just cancel the frontend/backend without other actions.)
- Does not use POSIX filesystem for persistence.

## 10. Dev/prod parity

> Keep development, staging, and production as similar as possible.

- [x] Meets Criteria

- All environments function the same way when configured with the same settings. Devs are able to run the app with the same settings and get the same experience.
- Flags can enable/disable functionality without knowledge of environment. There are no env checks within the app.

## 11. Logs

> Treat logs as event streams.

- [x] Meets Criteria

- Logs are emitted to `stdout`. This is done [by default](https://backstage.io/docs/plugins/observability#logging) when creating a backstage app.
- Events are structured event streams, in JSON.
- No logs are written to disk.

## 12. Admin processes

> Run admin/management tasks as one-off processes.

- [ ] Meets Criteria

- We don't have any cronjobs.
- Batch processing run as a separate container. (Building techdocs is moved out)

`Steps to Meet Criteria`

- Goes along with Spike to learn more about the DB.

## Decision

The application will use the 12-factor application checklist to determine if it is able to run effectively on kubernetes.

## Reference Links

- [GitHub](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/tree/main)
- [GitHub Actions](https://github.com/department-of-veterans-affairs/lighthouse-developer-portalper-portalper-portal/actions)
- [12-Factor app](https://12factor.net/)
- [Kubernetes](https://kubernetes.io/)
- [App](https://github.com/department-of-veterans-affairs/lighthouse-developer-portalper-portalper-portal/tree/twelve-factor-app-adr/packages/app)
- [Backend](https://github.com/department-of-veterans-affairs/lighthouse-developer-portalper-portal/tree/twelve-factor-app-adr/packages/backend)
- [Deployment](https://department-of-veterans-affairs.github.io/lighthouse-developer-portal/deployment/)
- [Health Check](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/blob/main/k8s/backstage.yaml#L26)
- [Frontend Dockerfile](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/blob/main/Dockerfile.frontend#L10)
- [Logging to stdout](https://backstage.io/docs/plugins/observability#logging)
