# Techdocs
- [Techdocs Overview](#Techdocs-Overview)
- [Techdocs Github Action](#Techdocs-Github-Action)
- [Techdocs GHA Overview](#Techdocs-GHA-Overview)
- [Techdocs GHA Prerequisites](#Techdocs-GHA-Prerequisites)
- [Techdocs GHA Usage](#Techdocs-GHA-Usage)
- [Example Workflow](#Example-Workflow)

## Techdocs Overview
[Techdocs](https://backstage.io/docs/features/techdocs/techdocs-overview) transforms documentation from markdown files in your repository into a bundle of static files(HTML, CSS, JSON, etc.) that can be rendered inside the Internal Developer Portal.

## Techdocs Github Action
The [Lighthouse Github Action](https://github.com/department-of-veterans-affairs/lighthouse-github-actions#techdocs-action) repository contains a Techdocs Action that can be referenced in your own workflows to create and publish your team's Techdocs. The Techdocs Action works by creating a Kubernetes Job that will pull a git repository then run the `techdocs-cli` to generate and publish your Techdocs to the Lighthouse S3 bucket.

You can add the action to an existing CI/CD workflow or add it as a standalone workflow triggered only when the `docs` directory is updated.

This action creates a [Kubernetes Job](https://github.com/department-of-veterans-affairs/lighthouse-github-actions/blob/main/example-techdocs-job.yaml) that will generate and publish your Techdocs for the Lighthouse Internal Developer Portal.

## Techdocs GHA Overview
The Kubernetes Job consists of two containers:  a [git-sync](https://github.com/kubernetes/git-sync) container and a `Techdocs` [container](https://github.com/department-of-veterans-affairs/lighthouse-github-actions/pkgs/container/lighthouse-github-actions%2Ftechdocs). The `git-sync` container is an initContainer that pulls a git repository to a shared volume so the Techdocs container has a copy of the repository. The `Techdocs` container then uses the [Techdocs-cli](https://backstage.io/docs/features/techdocs/cli) to generate and publish your documentation to the Lighthouse S3 bucket.

## Techdocs GHA Prerequisites
The root directory of your repository contains:
- [x] a [`catalog-info.yaml`](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/blob/main/catalog-info.yaml) with a [backstage.io/techdocs-ref](https://backstage.io/docs/features/software-catalog/well-known-annotations#backstageiotechdocs-ref) annotation
- [x] a [`mkdocs.yaml`](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/blob/main/mkdocs.yml) configuration file
- [x] a [`docs`](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/tree/main/docs) directory where all your documentation lives

More info about [Entity Descriptor files](https://backstage.io/docs/features/software-catalog/descriptor-format#overall-shape-of-an-entity)

## Techdocs GHA Usage

```yaml
- name: Create Techdocs Job
  uses: department-of-veterans-affairs/lighthouse-github-actions/.github/actions/techdocs@main
  with:
    # Owner and repository where the documentation lives (e.g. department-of-veterans-affairs/lighthouse-developer-portal)
    # Default: ${{ github.repository }}
    repository: ''

    # Name of Entity descriptor file; used to create Entity path (i.e. namespace/kind/name)
    # Default: 'catalog-info.yaml'
    descriptor-file: ''

    # Namespace of the Catalog Entity in the Lighthouse Developer Portal
    # Default: 'default'
    # Note: This value should match the 'metadata.namespace' field in the Entity descriptor file.
    # The 'metadata.namespace' field is arbitrary and does not correspond to an actual Kubernetes namespace.
    # It is recommended to use your team name for the 'metadata.namespace' field to prevent collisions with
    # Catalog Entities from other teams.
    namespace: ''

    # Personal Access Token used for Techdocs Webhook
    # Scopes: Repo
    token: ''
```
## Example Workflow

```yaml
# Example workflow
name: Publish Documentation
on:
  push:
    branches: [main]
    paths: ['docs/*']
jobs:
  create-techdocs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Techdocs webhook
        uses: department-of-veterans-affairs/lighthouse-github-actions/.github/actions/techdocs-webhook@main
        with:
          repository: ${{ github.repository }}
          descriptor-file: 'catalog-info.yaml'
          namespace: 'lighthouse-bandicoot'
          token: ${{ secrets.PAT }}
```