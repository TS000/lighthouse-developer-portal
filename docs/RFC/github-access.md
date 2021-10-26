# [RFC] GitHub Access and Authentication

## Summary

The Backstage application's backend needs access to GitHub API's and OAuth which both require some form of authentication. There are several ways to provide authentication credentials. Currently we are using Personal Access Tokens but these are tied to individual users. We want to determine if we can avoid using Personal Access Tokens for GitHub access.

## Background

One of the core features of the Backstage applications is the software catalog. The software catalog needs to pull information from YAML files. These YAML files are stored on repositories located on GitHub. The Backstage application will need some form of authentication in order to access different repositories across an organization.

The Backstage documentation outlines two approaches for backend authentication: using GitHub Apps and using GitHub OAuth. The authentication models of these two approaches are different and we want to compare the two to evaluate which one is a better suit for our needs.

## Goal

Compare the pros and cons of using GitHub Apps versus GitHub OAuth for Backstage's backend authentication.

## Findings

### GitHub Apps
GitHub Apps are the officially recommended way to integrate with GitHub because they offer much more granular permissions to access data.

- GitHub Apps are first-class actors within GitHub. A GitHub App acts on its own behalf, taking actions via the API directly using its own identity, which means you don't need to maintain a bot or service account as a separate user.

- GitHub Apps can be installed directly on organizations and user accounts and granted access to specific repositories. They come with built-in webhooks and narrow, specific permissions.

- Don't expect the GitHub App to know and do everything a user can.

- Don't use a GitHub App if you just need a "Login with GitHub" service. But a GitHub App can use a [user identification flow](https://docs.github.com/en/developers/apps/building-github-apps/identifying-and-authorizing-users-for-github-apps) to log users in and do other things.

- Don't build a GitHub App if you only want to act as a GitHub user and do everything that user can do.

### OAuth App

An OAuth App uses GitHub as an identity provider to authenticate as the user who grants access to the app. This means when a user grants an OAuth App access, they grant permissions to all repositories they have access to in their account, and also to any organizations they belong to that haven't blocked third-party access.

- An OAuth App should always act as the authenticated GitHub user across all of GitHub (for example, when providing user notifications).

- An OAuth App can be used as an identity provider by enabling a "Login with GitHub" for the authenticated user.

- Don't build an OAuth App if you want your application to act on a single repository. With the `repo` OAuth scope, OAuth apps can act on all of the authenticated user's repositories.

- Don't build an OAuth App to act as an application for your team or company. OAuth Apps authenticate as a single user, so if one person creates an OAuth App for a company to use, and then they leave the company, no one else will have access to it.

### Backstage GitHub Apps
The benefits of using GitHub Apps for Backstage include:
- Higher rate limits
- Backstage can act as an application instead of a user or bot
- Clearer and better authorization model

**Caveats**
- It's not possible to have multiple Backstage GitHub Apps installed in the same GitHub organization, to be handled by Backstage. Backstage doesn't check through all the registered GitHub Apps to see which ones are installed for a particular repository. Backstage only respects global Organization installs right now.
- App permissions is not managed by Backstage. They're created with some simple default permissions which we can change as we need, but we will need to update them in the GitHub web console, not in Backstage right now. The permissions that are defaulted are `metadata:read` and `contents:read`.
- The created GitHub App is private by default, this is most likely what you want for github.com but it's recommended to make your application `public` for GitHub Enterprise in order to share application across your GHE organizations.


## Recommendation

### Creating a Backstage GitHub App
It seems like the recommended approach is to create a GitHub App but Backstage cannot have multiple Backstage GitHub Apps on the same organization. So I believe this means that we would only be able to use a Backstage GitHub App if no one else in the DVA is using Backstage GitHub App. I know there is another developer portal but I don't know if they are even using Backstage or if they're planning to use a Backstage GitHub App. If they are using Backstage and plan to use a GitHub App then I think we will have to use OAuth apps.
