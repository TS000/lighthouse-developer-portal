# Signing Docker Images

|                |     |                |         |
| -------------- | --- | -------------- | ------- |
| Decision Made: | no  | Decision Date: | 12/2021 |

**Revisit criteria:**

Decision Made: No, but open to revisiting
Revisit Decision: Yes
Revisit Criteria: If a developer is interested in Signing Docker containers with a key that can be uploaded to https://keys.openpgp.org/, we should revisit this.

Decision Makers: @keyluck

## tl;dr
Docker Content Trust provides the ability to use digital signatures for data sent to and received from remote Docker registries. These signatures allow client-side or runtime verification of the integrity and publisher of specific image tags.

The `keys.openpgp.org` server is a public service for the distribution and discovery of OpenPGP-compatible keys, commonly referred to as a "keyserver".

We want to be able to sign our Docker images so consumers can guarantee this image was published by us and hasn’t been tampered with by someone else.

## History
I was able to use `docker trust` to generate keys, sign images, and then verify the images were signed using [Docker's Documentation](https://docs.docker.com/engine/security/trust/). I tried to upload the public key to https://keys.openpgp.org/ but received  the following error: `Error: Parsing of key data failed`.

I also created a private-public key pair using the [gpg command line utility](https://help.gooddata.com/doc/enterprise/en/expand-your-gooddata-platform/gooddata-integration-into-your-application/set-up-user-authentication-and-sso/gooddata-pgp-single-sign-on/how-to-generate-a-public-private-key-pair). I was able to successfully upload this public key to https://keys.openpgp.org/ using these [instructions](https://keys.openpgp.org/about/usage#gnupg).

I tried to add the key with `docker trust signer add` so I could use `docker trust` to sign the image with the gpg key but received the following error: `could not parse public key from file`.

## Pros
N/A

## Cons
N/A

## Decision
Not yet made


