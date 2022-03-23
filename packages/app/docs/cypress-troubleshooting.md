# Cypress Troubleshooting

Most issues can be resolved by reading the error listed within the test logs. Most errors are pretty straightforward and often provide tips on how to fix them. You can also lookup an error [here](https://docs.cypress.io/guides/references/error-messages). Otherwise, continue below.

## Common Errors

There are two common types of errors that you'll come across.

1. Cypress failed to run the test.
2. The App failed the test criteria. (assertion errors)

### Cypress Failed

Cypress failing can happen whenever a test isn't written correctly or if there's an issue with the syntax.

Most of these problems can be resolved by reviewing the test, referencing the API, or checking the best practices page.

[API](https://docs.cypress.io/api/table-of-contents)

[Best Practices](https://docs.cypress.io/guides/references/best-practices)

### Assertion Errors

This failure occurred when the app didn't meet the test criteria. For example, if the test is attempting to target text that cannot be located, or click a button that isn't there.

```stdout
AssertionError: Timed out retrying: Expected to find element: `span[title="Disable"]`, but never found it.
```

Cypress recommends that we use `data-*` tags to easily select elements for testing. Selectors should always target attributes that are resilient to changes.

Some best practices to keep in mind.

- Don't target elements based on CSS attributes such as: id, class, tag
- Don't target elements that may change their textContent

- Add data-\* attributes to make it easier to target elements

### Timeout Failures

Another common issue that can occur is if the app fails to load within a set time. Cypress will wait 1 minute before failing a test suite due to the app not loading. Usually, rerunning the test can fix it. Otherwise, there might be an issue with the test itself.

```stdout
CypressError: Timed out after waiting `60000ms` for your remote page to load.

Your page did not fire its `load` event within `60000ms`.

You can try increasing the `pageLoadTimeout` value in `cypress.json` to wait longer.

Browsers will not fire the `load` event until all stylesheets and scripts are done downloading.

When this `load` event occurs, Cypress will continue running commands.

Because this error occurred during a `before each` hook we are skipping the remaining tests in the current suite: `Feature Flags`
```

## CI / CD

### Checking the Logs

Viewing the logs can be the easiest way to understanding what went wrong during a test. You can locate them by clicking into any failed browser test and viewing the logs under the `Run cypress-io/GitHub-action@v2` step. It should auto-scroll to the end of the record where the error is listed.

These boxes display pass/fail metrics along with in-depth checks on failed tests. This will also be where the `error` will be listed. Once you have the error message, you can look it up on Cypress [here.](https://docs.cypress.io/guides/references/error-messages) Errors will also come with a few tips on how the error might be resolved. These messages are generally constructive, and following them will usually solve the problem.

### Viewing Artifacts

In addition to logs, Cypress will also take a screenshot of its test runner displaying the error, along with the webpage running next to it. Artifacts can be viewed/downloaded from the workflow summary page by clicking the number below `Artifacts` or by clicking the file listed at the end of the page.

Example screenshot of the cypress test runner.

![cypress test runner](https://docs.cypress.io/_nuxt/img/gui-diagram.dd71ece.png)

[Cypress Test Runner Docs](https://docs.cypress.io/guides/core-concepts/test-runner#Overview)

## Locally

Cypress can also be run locally to speed up debugging/testing. You can run the Cypress CLI by starting the frontend app.

1. cd into `packages/app`
2. Run `yarn start`
3. Open a second terminal window and run `yarn cy:run`

This will run through all the cypress tests. You can also specify specific files if you don't want to run through the entire suite.

[Install Cypress](https://docs.cypress.io/guides/getting-started/installing-cypress)

Cypress has a test runner that makes testing 1000% easier as you can view your tests running in real-time. Not to mention the ability to time-travel and interact with your tests.

Using the test runner is beyond the scope of this guide, so I'll leave a link to it below.

[The Test Runner](https://docs.cypress.io/guides/core-concepts/test-runner)

## References

- [Install Cypress](https://docs.cypress.io/guides/getting-started/installing-cypress)
- [Cypress Documentation](https://docs.cypress.io/api/table-of-contents)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Troubleshooting Guide](https://docs.cypress.io/guides/references/troubleshooting#Support-channels)
- [Error message Reference](https://docs.cypress.io/guides/references/error-messages)
- [Cypress Test Runner](https://docs.cypress.io/guides/core-concepts/test-runner#Overview)
