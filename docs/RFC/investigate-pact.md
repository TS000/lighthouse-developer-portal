# [RFC] Investigate Pact

## Summary

Contract testing is a tool used for testing HTTP and message integrations. It could help us catch CORS issues that can occur when the fronted communicates with the backend app.

## Background

Pact is a code-first tool for testing HTTP and message integrations using contract tests. Contract tests assert that inter-application messages conform to a shared understanding that is documented in a contract. Without contract testing, the only way to ensure that applications will work correctly together is by using expensive and brittle integration tests.

## Goal

Decide whether using Pact would allow us to catch CORS issues.

## Findings

### Pact

Pact can be used within a JS app by using [pact-js](https://github.com/pact-foundation/pact-js). They provide multiple testing examples for various frameworks, including Jest.

There is a [5 Minute Guide](https://docs.pact.io/5-minute-getting-started-guide) to understand how Pact works. I highly recommend reading through it.

Basic steps to using Pact:

1. Configure the mock API
2. Write a consumer test.
3. Run the consumer test.
4. Share the created contracts with the broker.
5. Write provider verification tests.
6. Run the provider tests.

### Consumer Side Testing

Pact has a package specifically for working with Jest, [jest-pact](https://github.com/pact-foundation/jest-pact). This can make writing tests much more effortless.

Instead of setting up a `new Pact({...})` we can use `pactWith`. `pactWith(JestPactOptions, (providerMock) => { /* tests go here */ })` is a wrapper that sets up a pact mock provider, applies sensible default options, and applies the setup and verification hooks so you don't have to.

```js
import { pactWith } from 'jest-pact';
import { Matchers } from '@pact-foundation/pact';
import api from 'yourCode';

pactWith({ consumer: 'MyConsumer', provider: 'MyProvider' }, provider => {
  let client;

  beforeEach(() => {
    client = api(provider.mockService.baseUrl)
  });

  describe('health endpoint', () => {
    // Here we set up the interaction that the Pact
    // mock provider will expect.
    //
    // jest-pact takes care of validating and tearing
    // down the provider for you.
    beforeEach(() => // note the implicit return.
      // addInteraction returns a promise.
      // If you don't want to implicit return,
      // you will need to `await` the result
      provider.addInteraction({
        state: "Server is healthy",
        uponReceiving: 'A request for API health',
        willRespondWith: {
          status: 200,
          body: {
            status: Matchers.like('up'),
          },
        },
        withRequest: {
          method: 'GET',
          path: '/health',
        },
      })
    );

    // You also test that the API returns the correct
    // response to the data layer.
    //
    // Although Pact will ensure that the provider
    // returned the expected object. You need to test that
    // your code receives the right object.
    //
    // This is often the same as the object that was
    // in the network response, but (as illustrated
    // here) not always.
    it('returns server health', () => // implicit return again
      client.getHealth().then(health => {
        expect(health).toEqual('up');
      }));
  });
```

### Pact Broker

It enables you to share your pacts and verification results between projects and make them useful for people too. It is the recommended way forward for serious Pact development.

You can run an example `pact-broker` using Ruby and Rails. https://github.com/pact-foundation/pact_broker#usage

It's also possible to use their docker image, https://github.com/pact-foundation/pact-broker-docker

Otherwise, you'll need to run your own [pact-broker](https://github.com/pact-foundation/pact_broker#rolling-your-own).

Once the broker is up and running, you can publish your pact files to it using the following command:

`"pact:publish": "pact-broker publish <YOUR_PACT_FILES_OR_DIR> --consumer-app-version=1.0.0 --tag-with-git-branch --broker-base-url=https://your-broker-url.example.com"`

Additional CLI options can be found [here](https://github.com/pact-foundation/pact-ruby-standalone/releases) under `pact-broker client`. You can also include the username and password with `--broker-username` and `--broker-password.` Obviously, you should NEVER hard code these values. ENV variables can/should be used for this.

It's also possible to create a script that can further control publishing pacts to a broker.

### Provider tests

Provider tests are a lot simpler than consumer tests. We need to pull the contract from the Pact Broker and verify that the contract is correct.

[Provider API Testing](https://github.com/pact-foundation/pact-js#provider-api-testing)

Here is a very basic example of a Provider Test:

```js
const { Verifier } = require('@pact-foundation/pact');

const opts = {
  providerBaseUrl: 'http://127.0.0.1:7007',
  pactBrokerUrl: 'broker_url',
  provider: 'MyProvider',
  providerVersion: '1.0.0',
  pactBrokerUsername: 'test',
  pactBrokerPassword: 'test',
  logLevel: 'INFO',
};

describe('Pact Verification', () => {
  it('should validate the expectations of our consumer', () => {
    return new Verifier(opts).verifyProvider().then(() => {});
  });
});
```

## Recommendation

Pact was pretty confusing to set up and get running. Everything eventually fell into place once I was able to get the full loop working.
Pact testing would be a great idea to test any endpoints that we hit when communicating with the backend. Because of this, Pact would be a great fit for preventing CORS issues when merging branches into main or testing before we make a deployment.

I also think it'd be worth our time to get the pact broker running on Docker. However, using a host like Heroku would work as well.

Unfortunately, I couldn't get Pact working with Cypress, but I was able to get it working by using Jest. It wasn't easy at first, but some great documentation and some articles can walk through the setup. They are listed under the Reference section.

To make setup extra easy, I'll include the files I used to create the tests below.

### Consumer Tests

The Function:

```js
import axios from 'axios';

const defaultBaseUrl = 'http://127.0.0.1:5000';

export const getCatalogs = () =>
  axios
    .get(`${defaultBaseUrl}/catalog`, {
      headers: {
        Accept: 'application/json',
      },
    })
    .then(response => response.data.status);
```

The test:

```js
import { pactWith } from 'jest-pact';
import { Matchers } from '@pact-foundation/pact';
import { getCatalogs } from './pactCode.js';

const EXPECTED_BODY = {
  metadata: {
    namespace: 'default',
    name: 'guest',
  },
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'User',
};

pactWith(
  { consumer: 'MyConsumer', provider: 'MyProvider', port: 5000 },
  provider => {
    describe('health endpoint', () => {
      // Here we set up the interaction that the Pact
      // mock provider will expect.
      //
      // jest-pact takes care of validating and tearing
      // down the provider for you.
      beforeEach(() => {
        provider.addInteraction({
          state: 'Server is healthy',
          uponReceiving: 'A request for the Catalogs',
          willRespondWith: {
            status: 200,
            body: {
              status: Matchers.like(EXPECTED_BODY),
            },
            headers: { 'Access-Control-Allow-Origin': '*' },
          },
          withRequest: {
            method: 'GET',
            path: '/catalog',
          },
        });
      });

      // You also test that the API returns the correct
      // response to the data layer.
      //
      // Although Pact will ensure that the provider
      // returned the expected object. You need to test that
      // your code receives the right object.
      //
      // This is often the same as the object that was
      // in the network response, but (as illustrated
      // here) not always.
      it('returns catalogs', () =>
        getCatalogs().then(catalogs => {
          expect(catalogs).toEqual(EXPECTED_BODY);
        }));
    });
  },
);
```

### Pact Broker

The pact broker was made using Ruby and Rails, then published to Heroku. Information can be found within the findings section.

### Provider Tests

```js
const { Verifier } = require('@pact-foundation/pact');

const opts = {
  providerBaseUrl: 'http://127.0.0.1:7007',
  pactBrokerUrl: 'https://polar-forest-27410.herokuapp.com/',
  provider: 'MyProvider',
  providerVersion: '1.0.0',
  pactBrokerUsername: 'test',
  pactBrokerPassword: 'test',
  logLevel: 'INFO',
};

describe('Pact Verification', () => {
  it('should validate the expectations of our consumer', () => {
    return new Verifier(opts).verifyProvider().then(() => {});
  });
});
```

## Reference

- [Pact](https://docs.pact.io/)
- [pact-js](https://github.com/pact-foundation/pact-js)
- [jest-pact](https://github.com/pact-foundation/jest-pact)
- [pact-broker](https://github.com/pact-foundation/pact_broker)
- [pact-broker-docker](https://github.com/pact-foundation/pact-broker-docker)
- [jest-pact-article](https://www.mariedrake.com/post/contract-testing-with-pact-js-and-jest)
