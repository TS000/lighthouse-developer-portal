# lighthouse-developer-portal: GitHub Packages

## Getting Started

First, you must create a Personal Access Token in order to use GitHub Packages. You can do that by following [this link](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token). The Personal Access Token(PAT) should have the following permissions:

- [x] repo
  - [x] repo:status
  - [x] repo_deployment
  - [x] public_repo
  - [x] repo:invite
  - [x] security_events
- [x] write:packages
  - [x] read:packages

Once created you will need to use the token. There are two ways to do this. Either create a `.npmrc` file or login using the CLI.

**.npmrc** Note: This file is ignored by git and will not be pushed to the repo

Create a `.npmrc` file and add the following text.

```
// .npmrc
//npm.pkg.github.com/:_authToken=<TOKEN>
```

**CLI**

You can use the `npm login` command.

```bash
npm login --scope=@OWNER --registry=https:/npm.pkg.github.com

> Username: USERNAME
> Password: TOKEN
> Email: PUBLIC_EMAIL_ADDRESS
```

You can verify that your information is correct by running the following command:

`npm whoami --registry https://npm.pkg.github.com`

This should return your GitHub username.

### Pulling Dependencies

Pulling dependencies from GitHub Packages should work as long as you've authenticated your Personal Access Token (above) and that your account has access to the organization that your trying to pull from.

GitHub Actions must use a Personal Access Token to install private GitHub Packages.

### Publishing Packages

Publishing packages to GitHub Packages requires some settings within a packages `package.json` file.

> Note: Packages that belong to a namespace must include the namespace within the package name.

```json
{
  "name": "@example/package-name",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com" // Tells NPM we are publishing to the GitHub Registry
  },
  "repository": "git://github.com/example/package-name.git" // Must match the URL of the repository
}
```

Now we can publish the package by running `npm publish`.

Assuming everything was configured correctly you should be able to check the `packages` listed in the repo or within the account owner.

GitHub Actions can publish private GitHub Packages by using a `GITHUB_TOKEN`.

## Reference

- [Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
- [GitHub Packages](https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages#authenticating-to-github-packages)
- [Department of Veteran Affairs Packages](https://github.com/orgs/department-of-veterans-affairs/packages)
- [Article: How to Use GitHub Packages for a Private npm Registry](https://spencerjones.blog/github-packages-private-npm/)
