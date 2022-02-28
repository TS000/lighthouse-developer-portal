# [RFC] Github App Auth

## Summary

Backstage can be configured to use GitHub Apps for backend authentication. This comes with advantages such as higher rate limits and that Backstage can act as an application instead of a user or bot account.

It also provides a much clearer and better authorization model as a opposed to the OAuth apps and their respective scopes.

## Background

Account owners can use a GitHub App in one account without granting access to another. For example, you can install a third-party build service on your employer's organization, but decide not to grant that build service access to repositories in your personal account. A GitHub App remains installed if the person who set it up leaves the organization.

An authorized OAuth App has access to all of the user's or organization owner's accessible resources.

## Goal

Provide a Proof-of-concept work for implementing GitHub App within the Lighthouse developer portal.

## Findings

Backstage has a CLI command that can be used to [create a github app](https://backstage.io/docs/local-dev/cli-commands#create-github-app) for an organization.

`yarn backstage-cli create-github-app <github-org>`

This command launches a browser to create the app through Github and saves teh result as a YAML file that can be referenced in the GitHub integration configuration.

The created `YAML` file must include the following information. You can also create this file yourself if you didn't use the CLI command.

```yaml
appId: <app-id>
clientId: <client-id>
clientSecret: <client-secret>
webhookSecret: <webhook-secrete>
privateKey: |
  -----BEGIN RSA PRIVATE KEY-----
  ...<key-content>...
  -----END RSA PRIVATE KEY-----
```

Note: It's possible to limit the GitHub app installations visible to backstage by including the `allowedInstallationOwners` option. It will result in backstage preventing the use of any installation that is not within the allow list.

The `YAML` file will then need to be added to the `app-config.yml` integrations.

```yaml
integrations:
  github:
    - host: github.com
      apps:
        - $include: example-backstage-app-credentials.yaml
```

These are teh minimum permissions required for creating a pull request with Backstage software templates:

- Read and Write permissions for `Contents`.
- Read and Write permissions for `Pull Requests` and `Issues`.
- Read permissions on `Metadata`.

## Recommendation

Implementing a GitHub App integration for the Lighthouse developer portal was fairly easy following the [Backstage GitHub App Guide](https://backstage.io/docs/plugins/github-apps#docsNav). However this might be something we want to wait on until some of the listed caveats are updated. If we're all okay with the listed issues, I think it'd be a great tool for backend authentication.

We'll also need to find a way to store the `YAML` file that includes all the GitHub App secrets as it shouldn't ever ever ever be committed to the repository.

### Caveats

- It's not possible to have multiple Backstage GitHub Apps installed in the same GitHub organization, to be handled by Backstage. We currently don't check through all the registered GitHub Apps to see which ones are installed for a particular repository. We only respect global Organization installs right now.

- App permissions are not managed by backstage. They're created with some simple default permissions which you are free to change as you need, but you will need to update them in the GitHub web console, not in Backstage right now. The permissions that are defaulted are `metadata:read` and `contents:read`.

- The created GitHub App is private by default, this is most likely what you want for github.com but it's recommended to make your application public for GitHub Enterprise in order to share application across your GHE organizations.

## Reference

- [Backstage Github Apps](https://backstage.io/docs/plugins/github-apps#docsNav)
- [Backstage create-github-app](https://backstage.io/docs/local-dev/cli-commands#create-github-app)
- [Github Identifying and authorizing users for GitHub Apps](https://docs.github.com/en/developers/apps/building-github-apps/identifying-and-authorizing-users-for-github-apps)
- [Github apps vs Oauth apps](https://docs.github.com/en/developers/apps/getting-started-with-apps/differences-between-github-apps-and-oauth-apps)
