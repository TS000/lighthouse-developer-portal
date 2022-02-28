# GitHub Packages

|                   |     |                |       |
| ----------------- | --- | -------------- | ----- |
| Decision Made:    | yes | Decision Date: | 11/21 |
| Revisit Decision: | no  | Date           | N/A   |

**Revisit criteria:**

Decision Made: Yes, but open to revisiting decision if a better private package registry becomes available.
Revisit Decision: No Revisit Date: N/A
Revisit Criteria: If a better private package registry becomes available, we should look into it.

Decision Makers: @kaemonisland, @rianfowler

## tl;dr

Private packages will now be pulled from [GitHub Packages.](https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages#authenticating-to-github-packages) User's must login to the github package registry by using their account that's associated with the Department of Veteran Affairs along with a Personal Access Token with all Repo and write:packages permissions.

## History

- [Packages](https://github.com/orgs/department-of-veterans-affairs/packages)
- [GitHub Packages](https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages#authenticating-to-github-packages)

## Pros

- Our codebase is on GitHub, so our packages should be there too!
- Integrates with GH APIs, Actions, etc.
- Free for public packages

## Cons

- Any users that want to pull/push to private packages must create a Personal Access Token with `repo` and `write:packages` sections checked.

## Decision

GitHub Packages will be used for managing private packages for the lighthouse-developer-portal repo.

[Packages](https://github.com/orgs/department-of-veterans-affairs/packages)
