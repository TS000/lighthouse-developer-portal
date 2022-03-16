# GitHub Action Dependencies

## Actions

[Checkout](https://github.com/marketplace/actions/checkout)

`uses: actions/checkout@v2`

This action checks-out your repository under `$GITHUB_WORKSPACE`, so your workflow can access it.

[Upload a Build Artifact](https://github.com/marketplace/actions/upload-a-build-artifact)

`uses: actions/upload-artifact@v2`

This uploads artifacts from your workflow allowing you to share data between jobs and store data once a workflow is complete.

[Download a Build Artifact](https://github.com/marketplace/actions/download-a-build-artifact)

`uses: actions/download-artifact@v2`

This downloads artifacts from your build

[GitHub Script](https://github.com/marketplace/actions/github-script)

`uses: actions/github-script@v3`

This action makes it easy to quickly write a script in your workflow that uses the GitHub API and the workflow run context.

[Setup Node.js Environment](https://github.com/marketplace/actions/setup-node-js-environment)

`uses: actions/setup-node@v1`

This action provides the following functionality for GitHub Action users:

- Optionally downloading and caching distribution of the requested Node.js version, and adding it to the PATH.
- Optionally caching npm/yarn/pnpm dependencies.
- Registering problem matchers for error output.
- Configuring authentication for GPR or NPM.

[Setup Java JDK](https://github.com/marketplace/actions/setup-java-jdk)

`uses: actions/setup-java@v2`

This action provides the following functionality for GitHub Actions runners:

- Downloading and setting up a requested version of Java. See Usage for a list of supported distributions
- Extracting and caching custom version of Java from a local file
- Configuring runner for publishing using Apache Maven
- Configuring runner for publishing using Gradle
- Configuring runner for using GPG private key
- Registering problem matchers for error output
- Caching dependencies managed by Apache Maven
- Caching dependencies managed by Gradle

[Cache](https://github.com/marketplace/actions/cache)

`uses: actions/cache@v2.1.7`

This action allows caching dependencies and build outputs to improve workflow execution time.

## GitHub

[CodeQL Action](https://github.com/github/codeql-action)

`uses: github/codeql-action/upload-sarif@v1`

This actio runs GitHub's industry-leading semantic code analysis engine, CodeQL, against a repository's source code to find security vulnerabilities. It then automatically uploads the results to GitHub so they can be displayed in the repository's security tab. CodeQL runs an extensible set of queries, which have been developed by the community and the GitHub Security Lab to find common vulnerabilities in your code.

## Cypress-io

[cypress-io/github-action](https://github.com/marketplace/actions/cypress-io)

`uses: cypress-io/github-action@v2`

[GitHub Action](https://docs.github.com/en/actions) for running [Cypress](https://www.cypress.io/) end-to-end tests. Includes NPM installation, custom caching and lots of configuration options.

## DataDog

[Datadog Action](https://github.com/marketplace/actions/datadog-action)

`uses: masci/datadog@v1`

This action lets you send events and metrics to Datadog from a GitHub workflow.

## Docker

[Docker Setup QEMU](https://github.com/marketplace/actions/docker-setup-qemu)

`uses: docker/setup-qemu-action@v1`

GitHub Action to install [QEMU](https://github.com/qemu/qemu) static binaries.

[Docker Setup Buildx](https://github.com/marketplace/actions/docker-setup-buildx)

`uses: docker/setup-buildx-action@v1`

GitHub Action to set up Docker [Buildx](https://github.com/docker/buildx).

This action will create and boot a builder that can be used in the following steps of your workflow if you're using buildx. By default, the `docker-container` [builder driver](https://github.com/docker/buildx/blob/master/docs/reference/buildx_create.md#driver) will e used to be able to build multi-platform images and export cache thanks to the [BuildKit](https://github.com/moby/buildkit) container.

[Docker Login](https://github.com/marketplace/actions/docker-login)

`uses: docker/login-action@v1`

GitHub Action to login against a Docker registry.

[Build and Push Docker Images](https://github.com/marketplace/actions/build-and-push-docker-images)

`uses: docker/build-push-action@v2`

GitHub Action to build and push Docker images with Buildx with full support of the features provided by [Moby BuildKit](https://github.com/moby/buildkit) builder toolkit. This includes multi-platform build, secrets, remote cache, etc. and different builder deployment/namespacing options.

[Docker Metadata action](https://github.com/marketplace/actions/docker-metadata-action)

`uses: docker/metadata-action@98669ae865ea3cffbcbaa878cf57c20bbf1c6c38`

GitHub Action to extract metadata from Git reference and GitHub events. This action is particularly useful if used with [Docker Build Push](https://github.com/docker/build-push-action) action to tag and label Docker images.

## Azure

[Kubernetes Set Context](https://github.com/marketplace/actions/kubernetes-set-context)

`uses: azure/k8s-set-context@v1`

This action can be used to set cluster context before other actions like `azure/k8s-deploy`, `azure/k8s-create-secret` or any kubectl commands (in script) can be run subsequently in the workflow.

## Changesets

[Changesets Release Action](https://github.com/changesets/action)

`uses: changesets/action@c3d88279fd9abe11410de073005e34863f735b1c`

This action for [Changesets](https://github.com/atlassian/changesets) creates a pull request with all of the package versions updated and changelogs updated and when there are new changesets on master, the PR will be updated. When you're ready, you can merge the pull request and you can either publish the packages to npm manually or setup the action to do it for you.

## Other

[Create Pull Request](https://github.com/peter-evans/create-pull-request)

`uses: peter-evans/create-pull-request@ebc5e0258578dc3e4b0da1f649c75ec39fb6a1f4`

A GitHub action to create a pull request for changes to your repository in the actions workspace.

[Very Good Coverage](https://github.com/VeryGoodOpenSource/very_good_coverage)

`uses: VeryGoodOpenSource/very_good_coverage@cfe8b79401ea7689953705f0d161cb51113f346f`

A Github Action which helps enforce a minimum code coverage threshold.

[GitHub Pages Deploy Action](https://github.com/JamesIves/github-pages-deploy-action)

`uses: JamesIves/github-pages-deploy-action@4.1.5`

This [GitHub Action](https://github.com/features/actions) will automatically deploy your project to [GitHub Pages](https://pages.github.com/). It can be configured to push your production-ready code into any branch you'd like, including gh-pages and docs. It can also handle cross repository deployments and works with [GitHub Enterprise](https://github.com/enterprise) too.
