# Title

|                   |     |                |         |
| ----------------- | --- | -------------- | ------- |
| Decision Made:    | yes | Decision Date: | 03/2022 |
| Revisit Decision: | no  | Date           | 01/2023 |

**Revisit criteria:**

Decision Made: The [secrel](https://musical-fiesta-cd7b4cef.pages.github.io/) pipeline will be integrated with the lighthouse-development-portal.
Revisit Decision: No Revisit Date: 01/2023
Revisit Criteria: N/A

Decision Makers: @KaemonIsland

## tl;dr

Integrate the SecRel pipeline into the lighthouse-developer-portal.

## Pros

- Easily scan docker images with [Snyk](https://snyk.io/) and [Aqua](https://support.aquasec.com/support/home).
- Builds and pushes images for the repo.
- Can be run manually with `workflow_dispatch`.
- Uses image signing
- Automated onboarding process.

## Cons

- Additional security measures must be put in place on the lighthouse-developer-portal so that others cannot run the pipeline.

## Decision

The SecRel pipeline will be used to build, scan, and release docker images for the lighthouse-developer-portal.

Followed the [Onboarding process](https://musical-fiesta-cd7b4cef.pages.github.io/ONBOARDING/) to integrate the pipeline. This required giving the `va-tornado-svc` write access to the lighthouse-developer-portal repo.

How to use

Below is a stand-alone GitHub Action yaml file that will listen for the repository_dispatch events above, and print out the information from the trigger.

```yaml
name: Custom Workflow File

on:
  repository_dispatch:
    types:
      - secrel-development-complete
      - secrel-release-complete

jobs:
  sample:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: output
        run: |
          echo "action trigger: ${{ github.event.action }}"
          echo "images: ${{ github.event.client_payload.images }}"
          echo "triggered-by: ${{ github.event.client_payload.triggered-by }}"
```

[SecRel Onboarding doc](https://musical-fiesta-cd7b4cef.pages.github.io/)
