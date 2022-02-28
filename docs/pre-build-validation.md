# Prebuild Validation

## Pre-build Validation Workflow

The pre-build validation workflow is defined in [pre-build-validation.yml](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/blob/build-validation/.github/workflows/pre-build-validation.yml)

### Name of workflow

This is the name of the workflow as it appears in GitHub's actions tab of the GitHub Repository

```
name: Pre-build Validation
```

### Events

This workflow can be triggered by two types of events: on pull requests with the main branch, and by other workflows.

```
on:
  pull_request:
    branches: [main]
  workflow_call:
```

### Jobs

The jobs section contains 3 jobs:

- unit-tests
  - This job references the workflow for our [unit tests workflow](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/blob/main/.github/workflows/unit-tests.yml). The commit SHA is used to identify which version of the workflow we want to use. If `unit-tests.yml` is updated, then the commit SHA will need to be updated in order for the pre-build validation workflow to use the correct version of `unit-tests.yml`.
- validate-unit-tests
  - This job interprets the results of the unit test job. If the unit tests were successful, it logs a message and the link to the unit-test run. If the unit tests failed, it posts a message to the `team-bandicoot` Slack channel to alert the team engineers that a changes containing failing unit tests have been merged to the `main` branch. This job will only run when the `pre-build validation` workflow is triggered by the `workflow_call` event which only occurs on merges with the `main` branch.
- validate linting
  - This job calls a composite action which invokes the Typescript compiler with `yarn tsc` and linting using yarn and lerna to call `backstage-cli lint` for each plugin and package.

```
jobs:
  unit-tests:
    uses: department-of-veterans-affairs/lighthouse-developer-portal/.github/workflows/unit-tests.yml@b965a7d3fca3d4d4794cd3792ff72c08a7ba0364

  validate-unit-tests:
      runs-on: ubuntu-latest
      needs: [unit-tests]
      if: ${{ github.event_name == 'workflow_call' }}
      steps:
        - uses: actions/checkout@v2
        - uses: ./.github/actions/validate-unit-tests
          with:
            SLACK_UID_001: ${{ secrets.SLACK_UID_ABDUSAMAD }}
            SLACK_UID_002: ${{ secrets.SLACK_UID_FOWLER }}
            SLACK_UID_003: ${{ secrets.SLACK_UID_LOVENDAHL }}
            SLACK_UID_004: ${{ secrets.SLACK_UID_LUCKEY }}
            SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}

  validate-linting:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Install dependencies
      uses: ./.github/actions/install-dependencies
    - name: Run linting
      uses: ./.github/actions/validate-linting
```
