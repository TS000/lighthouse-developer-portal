# Removing Google Analytics

|                   |     |                |         |
| ----------------- | --- | -------------- | ------- |
| Decision Made:    | yes | Decision Date: | 02/2022 |
| Revisit Decision: | no  | Date           | 06/2022 |

**Revisit criteria:**

Decision Made: No, but open to revisiting Decision Date: 12/2018
Revisit Decision: Yes Revisit Date: July 2019
Revisit Criteria: If a developer is interested in Jest and has time or suggestions for fixing the speed issues, we should revisit this.

Decision Makers: @kaemonisland

## tl;dr

Google Analytics will be removed.

## History

Previously we wanted to use an analytics tool to track usage of the app.

[Google Analytics](https://github.com/department-of-veterans-affairs/lighthouse-developer-portal/pull/206) was added to the Lighthouse developer portal.

GA was not really used, and was not being checked for user behavior. At most we were only tracking page views. Most of the relevant user behavior is output into the backend logs.

## Pros

- Single source for analytic data.
- Logs for queries and requests are already output to the log.

## Cons

- Could lose out on import user behavior that can only be tracked on the frontend.

## Decision

Google Analytics will be removed from the Lighthouse developer portal to be replaced by Datadog.

Datadog will now be the primary source of truth for analytics and logging information.
