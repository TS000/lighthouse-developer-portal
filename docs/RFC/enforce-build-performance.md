# [RFC] Enforce Build Performance

**Summary**:

Enforcing a built time will help us track how efficient our software pipeline is along with helping to expose issues that may surface as random spikes in the build time. We can surface these issues more directly by explicitly causing builds to fail when they go over a pre-determined amount of time.

## Background

Backstage has been setup to use a container for a [separate frontend](https://backstage.io/docs/deployment/docker#separate-frontend) that uses NGINX and a backend container. The build time seems to be about 12-13 minutes on average. Some can take as long as 15 while others can be as short as 7 minutes.

## Goal

Our goal is to enforce a maximum build time (15 minutes) that will allow us to keep track of how efficient our software pipeline is along with helping to expose issues that effect the application. GitHub Action Artifacts should be used the track the build-time and prevent PR's that increase the overall build time.

## Information

### GitHub Action Artifacts

[Storing Workflow Data as Artifacts](https://docs.github.com/en/actions/advanced-guides/storing-workflow-data-as-artifacts)

Artifacts allow you to persist data after a job has completed, and share that data with another job in the same workflow. An artifact is a file or collection of files produced during a workflow run. For example, you can use artifacts to save your build and test output after a workflow run has ended.

To share data between jobs:

- Uploading files: Give the uploaded file a name and upload the data before the job ends.
- Downloading files: You can only download artifacts that were uploaded during the same workflow run. When you download a file, you can reference it by name.

[Upload Artifact Action](https://github.com/actions/upload-artifact)
[Download Artifact Action](https://github.com/actions/download-artifact)

### Tracking Build Time

[Get Workflow Run Usage](https://docs.github.com/en/rest/reference/actions#get-workflow-run-usage)

Returns the total run time for a specific workflow run. Usage is listed for each GitHub-hosted runner operating system in milliseconds.

[List workflow runs](https://docs.github.com/en/rest/reference/actions#list-workflow-runs)

This action can list all workflow runs for a workflow. Additional parameters can be used to narrow a search.

### Stopping PR's by Build Time

Jobs can have a `timeout-minutes` setting that will fail a job if it exceeds the timeout. By default, it is 360. It can be set on a job or a single step within a job.

[Timeout-minutes ref](https://docs.github.com/en/actions/learn-github-actions/workflow-syntax-for-github-actions#jobsjob_idstepstimeout-minutes)

```yaml
my-job:
  runs-on: ubuntu-latest
  timeout-minutes: 15
```

## Recommendation

I think the best way to enforce a build time along with keeping track of builds over time should be done by using GitHub Artifacts.

An extra job should be added to the `build-containers` workflow that grabs all the previous workflow build times from the main branch, calculates an average build time, and then sets that value as an ENV variable.

```bash
# Obtaining workflow run usage

curl \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/{owner}/{repo}/actions/runs/{run_id}/timing
```

```yaml
# Setting an ENV variable

jobs:
  example-job:
    steps:
      - run: |
      echo 'NEW_ENV_VAR='<value> >> $GITHUB_ENV
```

Then, each build job can have a set timeout that adds a few minutes onto the average build. If the build exceeds the minutes it'll fail and display an error message that the build time was exceeded.
