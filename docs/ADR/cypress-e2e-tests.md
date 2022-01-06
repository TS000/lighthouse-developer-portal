# Cypress e2e Tests ADR

|                |     |                |         |
| -------------- | --- | -------------- | ------- |
| Decision Made: | yes | Decision Date: | 08/2021 |

**Revisit criteria:**

Decision Made: Yes
Revisit Decision: Not planned, but if another e2e testing frameworks become available.
Revisit Criteria: If another e2e testing frameworks becomes available that is faster, or performs better, we should revisit this.

Decision Makers: @KaemonIsland

## tl;dr

Backstage should have e2e testing to ensure that various dependencies of an application are working accurately. Along with allowing refactoring, and bug fixing to be much faster and easier. There are various e2e testing frameworks available and we chose [Cypress.](https://docs.cypress.io/guides/overview/why-cypress)

## History

Backstage came with Cypress [already installed](https://backstage.io/docs/getting-started/create-an-app). So it was easy to get started. Testing locally was a bit weird (Ran into an issue with missing dependencies).

For Linux users, or those using WSL. You can install all of the Cypress dependencies by following [this guide.](https://docs.cypress.io/guides/getting-started/installing-cypress#System-requirements)

Tests are also run as part of the CI/CD. [Here](https://github.com/department-of-veterans-affairs/lighthouse-embark/pull/121) is the PR adding them.

## Pros

- It's [open source.](https://github.com/cypress-io/cypress)
- Allows End-to-end, Integration, and Unit tests.
- Time Travel - Takes snapshots of tests.
- Debuggability - Debugging can be done using the Developer tools.
- Cross Browser Testing - Run tests on Firefox, chrome, edge, etc.
- Stubbing responses.

## Cons

- Can have difficulty setting up. (I've had trouble on multiple systems getting Cypress to run locally)
- Uses synthetic events instead of native ones.
- Stubbing can get out of hand fairly quickly.
- Bad support for iFrames. Usually have to use custom code.

## Decision

Backstage came with Cypress installed and most of the current developers have had an enjoyable experience working with it. So we've decided to stick with it.
