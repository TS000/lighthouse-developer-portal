# [RFC] Plugin Authentication and Authorization

**Summary**:
Backstage has implemented a new framework for permissions and authorization. The purpose of this system is to modify the existing authentication system with some ability to authorize access to certain content like data, APIs, or user interfaces.

## Background
Several updates<sup>[1](https://github.com/backstage/backstage/commit/8ceffe5f98f32f1bbc2f4ca9996309f314613842#diff-ec52f22d476ccc33271d11c4f08a68369614378aa0cb9aa5aba2f08943cd68df)[2](https://github.com/backstage/backstage/commit/24dce3ca434123ec90701aa91e58373f142c6a00#diff-bafb129928d4f3c909ae8b0772c4f1df9c7d8c11b096b60a9c80192b49ceb565)</sup> to Backstage's Backend Authentication included some changes to the way authentication is handled between the Backend plugin and plugin backends. Some of the changes are documented in this RFC for [Backend-to-backend authentication](https://github.com/backstage/backstage/blob/master/docs/tutorials/backend-to-backend-auth.md). The framework for permissions and authorization is currently being implemented as of Nov. 20, 2021<sup>[1](https://github.com/backstage/backstage/pull/7761)[2](https://github.com/backstage/backstage/pull/7761#issuecomment-974655528)[3](https://github.com/backstage/backstage/issues/5679#issuecomment-985241273)</sup>.

The new permissions and authorization framework allows plugin backends to use tokens from a shared key stored in the `app-config`. A `TokenManager` can be used to create server tokens for requests and can be used to authenticate tokens from incoming requests.

## Goal
Determine if any action is required on our part due to the newly added framework for permissions and authorization to Backstage.

## Recommendation
Currently there are no updates we need to do in response to these changes. The changes to implement the new framework using a `TokenManager` were handled during the last [Backstage Update PR](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/pull/328/files). The changes to include a shared backend secret are included with this [pull request](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/pull/388/files) to replace the use of Github Tokens by implementing a Github App.

The shared secret is a randomly generated string called `BACKEND_SECRET` saved to this repository's [Github Action Secrets](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/settings/secrets/actions). The string was generated using this command `node -p 'require("crypto").randomBytes(24).toString("base64")'` per this [documentation](https://backstage.io/docs/tutorials/backend-to-backend-auth).

At this point we would want to investigate a potential use-case and/or proof of concept that implements the new framework such as a guest user with restricted authorization and a limited user-interface(e.g. no access to software templates).