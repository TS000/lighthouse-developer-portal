# Split Frontend and Backend ADR

|                |     |                |         |
| -------------- | --- | -------------- | ------- |
| Decision Made: | yes | Decision Date: | 08/2021 |

**Revisit criteria:**

Decision Made: Yes
Revisit Decision: No
Revisit Criteria: None

Decision Makers: @KaemonIsland, @rianfowler

## tl;dr

The backstage app will have separate frontend and backend containers in order to scale both individually. i.e. We won't have to create as many frontend instances as backend instances if there is more traffic going to the backend.

## History

Originally, the lighthouse the Lighthouse developer portal docker images were setup to use a [Multi-stage Build.](https://backstage.io/docs/deployment/docker#multi-stage-build) Both the frontend and backend instances were built together, which worked fine however we wouldn't be taking advantage of scaling our application. It doesn't make sense to create more instances of the frontend if the backend is receiving a lot of traffic.

Backstage also has a guide to setup a [separate frontend](https://backstage.io/docs/deployment/docker#separate-frontend) that uses NGINX.

## Pros

- Frontend and Backend containers can be scaled individually.
- Easier to work on one without altering the other.
- Faster deployment

## Cons

- The build time for docker compose now takes longer.

## Decision

The Frontend and Backend will run in separate containers in order to allow for individual scaling.

[PR](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/pull/111)
