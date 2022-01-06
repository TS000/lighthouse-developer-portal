# Yarn Zero Install ADR

|                   |     |                |         |
| ----------------- | --- | -------------- | ------- |
| Decision Made:    | no  | Decision Date: | 00/0000 |
| Revisit Decision: | yes | Date           | 09/2021 |

**Revisit criteria:**

Decision Made: No, but open to revisiting Decision Date: 09/2021

Revisit Decision: Yes, Revisit Date: September 2021

Revisit Criteria: When [@backstage/cli](https://github.com/backstage/backstage/tree/master/packages/cli) replaces their [@yarnpkg/lockfile](https://www.npmjs.com/package/@yarnpkg/lockfile) parser usage with an updated package parser, [@yarnpkg/parsers](https://www.npmjs.com/package/@yarnpkg/parsers). Specifically, [this file.](https://github.com/backstage/backstage/blob/master/packages/cli/src/lib/versioning/Lockfile.ts#L22)

Decision Makers: @kaemonisland, @rianfowler

## tl;dr

CI/CD can take up to 10+ minutes to complete, specifically the [build-containers action.](https://github.com/department-of-veterans-affairs/lighthouse-embark/actions/workflows/build-containers.yml) Being able to use [Yarn Zero-Install](https://yarnpkg.com/features/zero-installs) would allow us to cache dependencies thus lowering the run-time of CI/CD by a significant amount.

## History

[Yarn](https://yarnpkg.com/) recently released a feature called [Zero Install](https://yarnpkg.com/features/zero-installs) which allows packages to be cached.

Yarn states the problem pretty clearly...

```
While Yarn does its best to guarantee that what works now will keep working, there's always the off chance that a future Yarn release will introduce a bug that will prevent you from installing your project. Or maybe your production environments will change and yarn install won't be able to write in the temporary directories anymore. Or maybe the network will fail and your packages won't be available anymore. Or maybe your credentials will rotate and you will start getting authentication issues. Or ... so many things can go wrong, and not all of them are things we can control.
```

## Pros

**Fast**

Caching packages will allow packages to be installed much faster than the current `yarn install`. ALso, when updating packages, Yarn 2 will change exactly one file for each updated package.

**Plug N Play**

Removes the need for node modules completely.
If we were able to get Zero Install + Plug n Play our install time would be almost instantaneous. https://yarnpkg.com/features/pnp#fixing-node_modules

**Small File Size**

To give you an idea, a node_modules folder of 135k uncompressed files (for a total of 1.2GB) gives a Yarn cache of 2k binary archives (for a total of 139MB). Git simply cannot support the former, while the latter is perfectly fine.

**Secure**

Projects accepting PRs from external users will have to be careful that the PRs affecting the package archives are legit (since it would otherwise be possible to a malicious user to send a PR for a new dependency after having altered its archive content).

`yarn install --check-cache`

This way Yarn will re-download the package files from whatever their remote location would be and will report any mismatching checksum.

## Cons

**Configuration**

Zero install can get confusing when configuring zero install for Lerna + TypeScript. Additional configuration settings will need to be applied in order for the linter to recognize the package locations.

[Plugins](https://yarnpkg.com/features/plugins)

## Decision

Adding Yarn Zero Installs will allow CI/CD and local development to get running faster. Currently, it takes about 2+ minutes to install all the necessary packages by running `yarn install`. Zero Install should allow us to cut that time down to less than one minute by caching packages. If we decide to also setup Plug N Play, we could cut that time down to almost instantaneous speeds.

The only thing that is holding us back is `@backstage/cli` which uses an incompatible package, `@yarnpkg/lockfile`, to parse the `yarn.lock` file.
