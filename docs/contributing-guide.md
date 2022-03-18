# Contributing to the Lighthouse Developer Portal
There are many ways to contribute to the Lighthouse developer portal. Learn more in these sections, or get started by <a href="/catalog-import.htm">adding an entity to the catalog</a>. 
- [Feature requests and feedback](#feature-requests-and-feedback)
- [Pull requests (PRs)](#pull-requests-prs) 
- [Bugs](#bugs)
- [Plugins](#plugins)

This project adheres to the [Spotify FOSS Code of Conduct](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/blob/main/CODE_OF_CONDUCT.md). By participating, you are expected to honor this code.

# Feature requests and feedback
Help us make the portal better by requesting features and providing feedback. Submit your feedback to Lighthouse using the Feedback option on the navigation pane. You can only submit feedback only if you are signed in to the developer portal with GitHub. If you do not have an account, creating one is quick and easy. 

## Request a feature
To request a new feature, [Create an Issue](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/issues). 

## Make a suggestion
To make a suggestion, create a request for comments (RFC) `.md` file and place it within `./docs/RFC`, then update `mkdocs` so that it can be viewed within our documentation. You can also add the `RFC` tag to an issue as well. 

# Pull requests (PRs) 
[Create a PR](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/pulls) to fix bugs, build new features, or build a plugin. 
- [Contribution requirements](#contribution-requirements)
- [Coding guidelines](#coding-guidelines)
- [Changesets](#changesets)
- [Updating build and deploy](#updating-build-and-deploy)
- [Merging to main](#merging-to-main) 

## Contribution requirements

- All changes require a second review.
- Work must be in small batches (no large PRs).
- Tests must cover +90% of new code (if applicable).
- PRs must be able to pass all required workflows.
- All changes must be [508 compliant](https://github.com/department-of-veterans-affairs/va.gov-team/blob/master/platform/accessibility/508-accessibility-best-practices.md).

## Coding guidelines

- Solve problems using Javascript
- Write automated tests for all significant code
- Structure code and comments as if your audience is junior Javascript maintainers
- Collaborate on substantial changes through RFCs
- Make small incremental changes that are generally not larger than 100 lines of non-testing code

All code is formatted with `prettier` using hte configuration in the repo. If possible we recommend configuring your editor to format automatically, but you can also use the `yarn prettier --write <file>` command to format files.

Be sure to skim through our [Decision Records](index.md) to see if they cover what you're working on.

All new documentation files should be added to the `docs` folder. This includes guides, troubleshooting, ADRs, RFCs, etc. You must also add the filename to the `mkdocs.yml` file or else it won't show up the

### Pre-Commit

Prior to making your first commit for this repo, be sure to run `pre-commit install && pre-commit install --hook-type commit-msg` from the root of the repo to ensure pre-commit hooks are run, which perform a variety of validations against your changes. Pre-commit installation instructions can be found at [pre-commit.com](https://pre-commit.com/index.html#install).

## Changesets
Any time a patch or change aligning to [Semantic Versioning](https://semver.org/) is made to any published package in `packages/` or `plugins/`, a changeset should be used. 

We use [changesets](https://github.com/atlassian/changesets) to help us prepare releases. Change sets help us make sure that every package affected by a change gets a proper version number and an entry in its `CHANGELOG.md`. To make the process of generating releases easy, it helps when you include changesets with your pull requests.

In general, changesets are not needed for the documentation, build utilities, etc.

### How to create a changeset

1. Run `yarn changeset`.
2. Select which packages you want to include a changeset for.
3. Select impact of change that you're introducing, using `minor` for breaking changes and `patch` otherwise. We do not use `major` changes while packages are at version 0.x.
4. Explain your changes in the generated changeset. It helps to provide additional clarity on deprecation or impacting changes which will then be included into CHANGELOGs.
5. Add generated changeset to Git. 
6. Push the commit with your changeset to the branch associated with your PR.
7. Accept our gratitude for making the release process easier on the maintainers!

You can [learn more about changesets in the changesets repository](https://github.com/atlassian/changesets/blob/main/docs/adding-a-changeset.md).

## Updating build and deploy

The core team is in charge of updating builds and deploys.

## Merging to main

We prefer the author of the PR to perform merges themselves when a PR is approved and if he contributor has earned write access to a repository. This allows them to own accountability for the change. They also likely know best how or when to address pending fixes or additional follow-ups. Working this way helps everyone contribute to the project's successful outcomes.

# Bugs
[Create an Issue](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/issues) to report a bug. 

# Plugins
[Create an Issue](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/issues) to suggest a plugin.

## Create a plugin
[Create a PR](#pull-requests-prs) to build a plugin. 
1. Open a Codespace from the Lighthouse Developer Portal repository.
2. Run `yarn create-plugin`.
3. When prompted, enter the name of your plugin.
4. Run the plugin with `yarn workspace @internal/<name-of-plugin> start`.

Learn more about [plugin development](https://backstage.io/docs/plugins/create-a-plugin). 

## Contributing your plugins
We want each team to have ownership of their plugins and to be able to make changes to their plugin without approval from another team.

1. Create an issue using the ['Contribute a plugin' template](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/issues/new/choose). 
2. Fill out the form with your team name and plugin information. 
3. Wait for final review and approval. 

Creating the issue will create a pull request to add your team as Codeowners of your plugin. Once the `lighthouse-bandicoot` team reviews and approves the request, your team will be able to create and review your own pull requests for changes to your plugin.

> Note: Pull requests that include integrating the plugin into the Lighthouse developer portal (such as modifications of `packages/frontend` or `packages/backend`) can be created but will still require final approval by the `lighthouse-bandicoot` team to be merged.

## Get Started

Follow along the [Running Locally](running-locally.md) doc to start working on lighthouse-developer-portal. You can use GitHub Codespaces (preferred) or run the app locally using Docker.

_lighthouse-developer-portal was built from [Backstage](https://backstage.io/docs/overview/what-is-backstage) by using `npx @backstage/create-app`. The @department-of-veterans-affairs/lighthouse-bandicoot team upgrades Backstage regularly to maintain access to the latest features._
