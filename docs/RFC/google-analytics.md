# [RFC] Google Analytics

## Summary

Analytic tracking allows us to track and understand our customer's behavior, user experience, online content, device functionality and more for the application.

## Background

Currently we have no method to track user events within the app. Backstage has a basic Analytics api that can be used. There are also some integrations for other analytic trackers like GA.

## Goal

Decide what needs to be done in order to use Google Analytics within the app.

## Findings

### Analytics Module: Google Analytics

Backstage has a [API integration](https://github.com/backstage/backstage/blob/master/plugins/analytics-module-ga/README.md) for Google Analytics.

Setting up is very easy:

1. install the plugin within `packages/app` and run `yarn add @backstage/plugin-analytics-module-ga`
2. Open `packages/app/src/api.ts`
3. Import `analyticsApiRef` and `configApiRef` from `@backstage/core-plugin-api`
4. Import `GoogleAnalytics` from `@backstage/plugin-analytics-module-ga`
5. use `createApiFactory` to add the analytics api to the app.

`api.ts` should then look like the following:

```js
// packages/app/src/apis.ts
import { analyticsApiRef, configApiRef } from '@backstage/core-plugin-api';
import { GoogleAnalytics } from '@backstage/plugin-analytics-module-ga';

export const apis: AnyApiFactory[] = [
  ...OtherImports
  // Instantiate and register the GA Analytics API Implementation.
  createApiFactory({
    api: analyticsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => GoogleAnalytics.fromConfig(configApi),
  }),
];
```

6. Configure `app-config.yaml` for GA.

```yaml
app:
  analytics:
    ga:
      trackingId: <ga-tracking-id> # Might also be named Measurement ID within GA
```

[Custom Dimensions](https://github.com/backstage/backstage/blob/master/plugins/analytics-module-ga/README.md#configuration) can also be included for further customization. Like tracking specific plugins.

There is also a [Test/Debug mode](https://github.com/backstage/backstage/blob/master/plugins/analytics-module-ga/README.md#debugging-and-testing) and a [Development mode](https://github.com/backstage/backstage/blob/master/plugins/analytics-module-ga/README.md#development)

Once everything is configured you can use the `useAnalytics` react hook within any React components to send events.

For Example:

```js
import React from 'react';
import { useAnalytics } from '@backstage/core-plugin-api';

export const MyCoolComponent = () => {
  const analytics = useAnalytics();

  const trackFunctionality = () => {
    analytics.captureEvent('test', 'test-service');
  };

  const handleClick = () => {
    analytics.captureEvent('click', 'The user clicked something!');
    // do something
  };

  useEffect(() => {
    // Capture page view
    analytics.captureEvent('navigate', 'Viewed MyCoolComponent');
  }, []);

  return <div>{...content}</div>;
};
```

### @analytics/google-analytics

Another package that allows us to send Google Analytics from the frontend is `@analytics/google-analytics`. It's a library that exports a plugin for [analytics.](https://www.npmjs.com/package/analytics) Analytics is a lightweight analytics abstraction library for tracking page views, custom events, and identify visitors.

You must install the `analytics` and `@analytics/google-analytics` packages in order for it to work.

```bash
yarn add analytics
yarn add @analytics/google-analytics
```

Then we just have to initialize the plugin.

```js
import Analytics from 'analytics';
import googleAnalytics from '@analytics/google-analytics';

const analytics = Analytics({
  app: 'awesome-app',
  plugins: [
    googleAnalytics({
      trackingId: 'UA-1234567',
    }),
  ],
});

/* Track a page view */
analytics.page();

/* Track a custom event */
analytics.track('playedVideo', {
  category: 'Videos',
  label: 'Fall Campaign',
  value: 42,
});

/* Identify a visitor */
analytics.identify('user-id-xyz', {
  firstName: 'bill',
  lastName: 'murray',
});
```

## Recommendation

I think it'd be best to use [Analytics Module: Google Analytics](https://github.com/backstage/backstage/blob/master/plugins/analytics-module-ga/README.md) to send events to GA. It's easy to setup and allows us to use the `useAnalytics()` hook within any components.

## Reference

[API integration](https://github.com/backstage/backstage/blob/master/plugins/analytics-module-ga/README.md)
[Backstage Analytics](https://backstage.io/docs/plugins/analytics)
[@analytics/google-analytics](https://www.npmjs.com/package/@analytics/google-analytics)
