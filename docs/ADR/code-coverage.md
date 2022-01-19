# Unit Test Code Coverage

|                   |     |                |       |
| ----------------- | --- | -------------- | ----- |
| Decision Made:    | yes | Decision Date: | 01/22 |
| Revisit Decision: | no  | Date           | 00/00 |

**Revisit criteria:**

Decision Made: Yes
Revisit Decision: Open to revisiting Decision Date: 12/2022
Revisit Criteria: If a developer is interested in adding tests for jest as well as cypress.

Decision Makers: @kaemonisland

## tl;dr

Added additional excluded folders to the Unit Test Code Coverage check. Running unit-tests on React code is unnecessary as we already have Cypress tests.
Unit testing our frontend code should only check util files.

## History

[Github Unit-Test action](https://github.com/department-of-veterans-affairs/lighthouse-embark/blob/main/.github/workflows/unit-tests.yml)

We use a github action called [VeryGoodOpenSource/very_good_coverage](https://github.com/VeryGoodOpenSource/very_good_coverage) to check code coverage within our packages. This action runs jest within the `app` and `backend` packages, and compares the coverage to all `.js` files.

## Pros

- Removes unnecessary tests from being required in the codebase.
- Allows us to be more strict on code-coverage by narrowing files.

## Cons

- Could miss covering code if not broken out from react components.
- Will need to use multiple `code-coverage` tools to get a better idea of how much code it covered.

## Decision

Currently, we use [Cypress](https://www.cypress.io/) for testing frontend code. Requiring test coverage with [jest](https://jestjs.io/) forces us to `double test` by checking component rendering with jest, and performing integration tests with cypress. Cypress will have to render a component in order to test it, which makes jests render test unnecessary.

The code-coverage github action will be updated to exclude files within `components`, `themes`, and `hooks` files. At some point a `utils` folder or similar should be created to store reusable methods. This will require contributors to be wary of when a function should be moved to the utils folder, or belong within a component/hook.

test test

Additionally, we should add a second test-coverage action that checks Cypress integration tests. Cypress has there own [code coverage](https://docs.cypress.io/guides/tooling/code-coverage) that we can run.
