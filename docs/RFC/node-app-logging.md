# [RFC] Node App Logging

**Summary**:

Logging provides numerous benefits to applications. Mainly to help provide visibility into how our applications are running on each of the various infrastructure components.

There are three major concerns for choosing a suitable logging library: recording, formatting, and storing messages. We need to make sure that our library of choice addresses all three concerns in a satisfactory manner.

## Background

Backstage comes with [Winston](https://github.com/winstonjs/winston#readme) already included which is nice as Winston is a popular logger for node applications. The logger is being used within various points of the `src/backend`. Routes seem to be the only thing being logged at the moment.
Backstage initiate's the logger within the [makeCreateEnv()](https://github.com/department-of-veterans-affairs/lighthouse-embark/blob/main/packages/backend/src/index.ts#L32) function.

Whether we decide to use Winston or another logging service ([Bunyan](https://github.com/trentm/node-bunyan#readme)) we should decouple the various import statements for winston and only use it within a single file. Any file wanting to use the logger should then import from our controlled logger making it easy to manage and/or change in the future.

## Goal

Our goal is to utilize a logger in order to provide a viewpoint into the backstage backend application. This will help to locate errors, catch bugs, and gather general information on how our application is used.

We should also decide on how or what should be logged within the application, and what logging levels should be used.

Either way logs will need to be output to `stdout` for easy consumption for services like [Datadog](https://www.datadoghq.com/).

## Recommendation

[Winston](https://github.com/winstonjs/winston#readme) is designed to be a simple and universal logging library with support for multiple storage devices. Each logger can have multiple transports configured at different levels. Winston also allows for flexibility and configuration for logging levels, formats, and interpolation of error messages. It's also one of the more popular logging libraries which means that others give it a lot of trust as well.

All current instances of importing the logger from backstage should be replaced with an import from a single file that we can name `logger.js`. This will decouple the logger from our code and make iterations or changing services much easier.

For logging levels, and usage I think it'd be best to be as vanilla as possible. Logging levels should conform to the severity ordering specified by [RFC5424](https://datatracker.ietf.org/doc/html/rfc5424): severity of all levels is assumed to be numerically ascending from most important to least important.

### Logging Levels

```js
// Default logging levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};
```

Logging Level Descriptions

- ERROR - Represents an error condition in the system that happens to halt a specific operation, but not the overall system.
- WARN - Indicates runtime conditions that are undesirable or unusual, but not necessarily errors. An example could be using a backup data source when the primary source is unavailable.
- INFO - Info messages are purely informative. Events that are user-driven or application-specific may be logged at this level. A common use of this level is to log interesting runtime events, such ast he startup or shutdown of a service.
- DEBUG - Used to represent diagnostic information that may be needed for troubleshooting.

Example usage.

`logger.info("Informative Message") // {"message":"Informative Message", "level":"info"}`

### Be Descriptive

Log entries should adequately describe the events that they represent. Each message should be unique to the situation and should clearly explain the event that occurred at that point.

Bad Example
"Request Failed, will retry."

Good Example
"POST" request to "https://example.com/api" failed. Response code: "429", response message: "too many requests". Retrying after "60" seconds.
