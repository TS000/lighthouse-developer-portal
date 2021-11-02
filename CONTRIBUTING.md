# Contributing to lighthouse-backstage

## Table of contents

- [Ways to Contribute](#ways-to-contribute)
- [Get Started](#get-started)
- [Code of conduct](#code-of-conduct)
- [Contribution requirements](#contribution-requirements)
- [Coding guidelines](#coding-guidelines)
- [Creating Changesets](#creating-changesets)
- [Updating build and deploy](#updating-build-and-deploy)
- [Merging to Main](#merging-to-main)

## Ways to contribute

[Create an Issue](https://github.com/department-of-veterans-affairs/lighthouse-backstage/issues) to:

- Report a Bug
- Suggest a Plugin
- Submit Feedback

[Create a PR](https://github.com/department-of-veterans-affairs/lighthouse-backstage/pulls) to:

- Fix a Bug
- Build New Features
- Build a Plugin

## Get Started

Follow along the [Running Locally](https://department-of-veterans-affairs.github.io/lighthouse-backstage/running-locally/) doc to start working on lighthouse-backstage. You can use GitHub Codespaces (preferred) or run the app locally using Docker.

_Lighthouse-backstage was built from [Backstage](https://backstage.io/docs/overview/what-is-backstage) by using `npx @backstage/create-app`. The @department-of-veterans-affairs/lighthouse-bandicoot team upgrades Backstage regularly to maintain access to the latest features._

## Code of conduct

This project adheres to the [Spotify FOSS Code of Conduct](https://github.com/department-of-veterans-affairs/lighthouse-backstage/blob/main/CODE_OF_CONDUCT.md). By participating, you are expected to honor this code.

## Contribution requirements

- All changes require a second review.
- Work must be in small batches (no large PRs)
- Tests must cover +90% of new code (if applicable)
- PRs must be able to pass all required workflows

## Coding guidelines

- Solve problems using Javascript
- Write automated tests for all significant code
- Structure code and comments as if your audience is junior Javascript maintainers
- Collaborate on substantial changes through RFCs
- Make small incremental changes generally not larger than 100 lines of non-testing code

All code is formatted with `prettier` using hte configuration in the repo. If possible we recommend configuring your editor to format automatically, but you can also use the `yarn prettier --write <file>` command to format files.

Be sure to skim through our [Decision Records](https://department-of-veterans-affairs.github.io/lighthouse-backstage) to see if they cover what you're working on.

All new documentation files should be added to the `docs` folder, that includes guides, troubleshooting, ADRs, RFCs, etc. You must also add the filename to the `mkdocs.yml` file or else it won't show up on the documentation website.

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
