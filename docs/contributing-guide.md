# Contributing to lighthouse-developer-portal

## Table of contents

- [Ways to Contribute](#ways-to-contribute)
- [Get Started](#get-started)
- [Code of conduct](#code-of-conduct)
- [Contribution requirements](#contribution-requirements)
- [Coding guidelines](#coding-guidelines)
- [Creating Changesets](#creating-changesets)
- [Updating build and deploy](#updating-build-and-deploy)
- [Merging to Main](#merging-to-main)
- [Creating plugins](#creating-plugins)
- [Contributing your plugins](#contributing-your-plugins)
- [Secrets Management](#secrets-management)

## Ways to contribute

[Create an Issue](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/issues) to:

- Report a Bug
- Suggest a Plugin
- Submit Feedback

Have a suggestion or request for a new feature?

Create an RFC `.md` file and place it within `./docs/RFC`, then update `mkdocs` so that it can be viewed within our documentation. You can also add the `RFC` tag to the issue as well.

[Create a PR](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/pulls) to:

- Fix a Bug
- Build New Features
- Build a Plugin

## Get Started

Follow along the [Running Locally](running-locally.md) doc to start working on lighthouse-developer-portal. You can use GitHub Codespaces (preferred) or run the app locally using Docker.

_lighthouse-developer-portal was built from [Backstage](https://backstage.io/docs/overview/what-is-backstage) by using `npx @backstage/create-app`. The @department-of-veterans-affairs/lighthouse-bandicoot team upgrades Backstage regularly to maintain access to the latest features._

## Code of conduct

This project adheres to the [Spotify FOSS Code of Conduct](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/blob/main/CODE_OF_CONDUCT.md). By participating, you are expected to honor this code.

## Contribution requirements

- All changes require a second review.
- Work must be in small batches (no large PRs)
- Tests must cover +90% of new code (if applicable)
- PRs must be able to pass all required workflows
- All changes must be [508 compliant](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/platform/accessibility/508-accessibility-best-practices.md)

## Coding guidelines

- Solve problems using Javascript
- Write automated tests for all significant code
- Structure code and comments as if your audience is junior Javascript maintainers
- Collaborate on substantial changes through RFCs
- Make small incremental changes generally not larger than 100 lines of non-testing code

All code is formatted with `prettier` using hte configuration in the repo. If possible we recommend configuring your editor to format automatically, but you can also use the `yarn prettier --write <file>` command to format files.

Be sure to skim through our [Decision Records](index.md) to see if they cover what you're working on.

All new documentation files should be added to the `docs` folder, that includes guides, troubleshooting, ADRs, RFCs, etc. You must also add the filename to the `mkdocs.yml` file or else it won't show up on the documentation website.

### Pre-Commit

Prior to making your first commit for this repo, be sure to run `pre-commit install && pre-commit install --hook-type commit-msg` from the root of the repo to ensure pre-commit hooks are run, which perform a variety of validations against your changes. Pre-commit installation instructions can be found at [pre-commit.com](https://pre-commit.com/index.html#install).

## Creating Changesets

We use [changesets](https://github.com/atlassian/changesets) to help us prepare releases. They help us make sure that every package affected by a change gets a proper version number and an entry in its `CHANGELOG.md`. To make the process of generating releases easy, it helps when contributors include changesets with their pull requests.

### When to use a changeset?

Any time a patch, minor, or major change aligning to [Semantic Versioning](https://semver.org/) is made to any published package in `packages/` or `plugins/`, a changeset should be used. It helps to provide additional clarity on deprecation or impacting changes which will then be included into CHANGELOGs.

In general, changesets are not needed for the documentation, build utilities, etc.

### How to create a changeset

1 Run `yarn changeset`
2 Select which packages you want to include a changeset for
3 Select impact of change that you're introducing, using `minor` for breaking changes and `patch` otherwise. We do not use `major` changes while packages are at version 0.x.
4 Explain your changes in the generated changeset.
5 Add generated changeset to Git
6 Push the commit with your changeset to the branch associated with your PR
7 Accept our gratitude for making the release process easier on the maintainers

For more information, checkout [adding a changeset](https://github.com/atlassian/changesets/blob/main/docs/adding-a-changeset.md) documentation in the changesets repository.

## Updating build and deploy

The core team is in charge of updating builds and deploys.

## Merging to Main

For those contributors who have earned write access to the repository, when a pull request is approved, in general we prefer the author of the PR to perform the merge themselves. This allows them to own accountability for the change and they likely know best how or when to address pending fixes or additional follow-ups. In this way, we all help contribute to the project's successful outcomes.

## Creating plugins

- Open a Codespace from the Lighthouse Developer Portal repository
- Run `yarn create-plugin`
- When prompted, enter the name of your plugin
- Run the plugin with `yarn workspace @internal/<name-of-plugin> start`
> More information about Backstage's [plugin development](https://backstage.io/docs/plugins/create-a-plugin)

## Contributing your plugins
We want each team to have ownership of their plugins and to be able to make changes to their plugin without approval from another team.

- Create an issue using the ['Contribute a plugin' template](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/issues/new/choose)
- Fill out the form with your team name and plugin information
- Wait for final review and approval

Creating the issue will create a pull request to add your team as Codeowners of your plugin. Once the `lighthouse-bandicoot` team reviews and approves the request, your team will be able to create and review your own pull requests for changes to your plugin.

> Note: Pull requests that include integrating the plugin into the Lighthouse Developer Portal (i.e. modifications of `packages/frontend` or `packages/backend`) can be created but will still require final approval by the `lighthouse-bandicoot` team to be merged.

## Secrets Management

Secrets that can be easily re-generated, such as Github Access Tokens, should just be stored directly in Github Actions Secrets. Secrets that need to be backed up in some storage medium should be created as Kubernetes secrets for the given environment using the `update_auth_secret.sh` and `update_generic_secret.sh` scripts in this repo, depending on the type of secret. Run either script, e.g. `./scripts/update_auth_secret.sh` or `./scripts/update_auth_secret.sh -h` to see usage. These scripts assume that the `~/.kube/config` credentials required to access the given environment are already present.
