# [RFC] Browser Logs

## Summary

We want to be able to record and view browser logging events so that we can gain real-time insight into how our application is operating from the end user's perspective.

## Background

Typically when the front end of a web based application has some kind of event to log, it is displayed in the browser's console. Having access to the console logs is helpful for the purposes of identifying and debugging errors or other problems with the application during run time. Since console logs are reported in the browser, developers do not have access to or any way of knowing if users are experiencing client errors while using an application. 

Datadog Browser Logs provide a way where we as developers can have access to console logs. Any kind of info, warning, or error messages that would be displayed in the browser's console can be sent to Datadog and recorded as log events. 

## Goal

Use Datadog Browser Logs to implement real-time client side error reporting.

## Findings

### Initializing Datadog Logs

Datadog Logs are initialized using the following:

```
import { datadogLogs } from '@datadog/browser-logs'

datadogLogs.init({
  clientToken: '<DATADOG_CLIENT_TOKEN>',
  site: '<DATADOG_SITE>',
  forwardErrorsToLogs: true,
  sampleRate: 100,
})
```



For future reference, the following parameters are available to configure the Datadog browser logs SDK to send logs to Datadog:

| PARAMETER             |   TYPE    |   REQUIRED    |   DEFAULT	        |   DESCRIPTION   |
| ---                   | ---       | ---           | ---               | ---             |
| clientToken           |	String	|    Yes	    |                   |  A Datadog client token.    |
| site	                |   String	|    Yes	    | `datadoghq.com`   | The Datadog site of your organization. US: datadoghq.com, EU: datadoghq.eu    |
| service	            |   String	|    No		    |                   | The service name for your application.
| env	                |   String	|    No		    |                   | The application’s environment, for example: prod, pre-prod, staging, etc.
| version	            |   String	|    No		    |                   | The application’s version, for example: 1.2.3, 6c44da20, 2020.02.13, etc. |
| forwardErrorsToLogs	|   Boolean	|    No         |	`true`          | Set to false to stop forwarding console.error logs, uncaught exceptions and network errors to Datadog. |
| sampleRate	        |   Number	|   No	        |   `100`           | The percentage of sessions to track: 100 for all, 0 for none. Only tracked sessions send logs. |
| silentMultipleInit	|   Boolean	|   No	        |	                | Prevent logging errors while having multiple init.|
| proxyUrl	            |   Boolean |	No	        |	                | Optional proxy URL (ex: https://www.proxy.com/path), see the full proxy setup guide for more information. |

Options that must have a matching configuration when using the RUM SDK:
| PARAMETER             |   TYPE    |   REQUIRED    |   DEFAULT	| DESCRIPTION         |
| ---        | ---        | ---        | ---        | ---|
| trackSessionAcrossSubdomains |	Boolean	 | No	| false |	Preserve the session across subdomains for the same site. |
| useSecureSessionCookie |	Boolean	| No |	false |	Use a secure session cookie. This disables logs sent on insecure (non-HTTPS) connections. |
| useCrossSiteSessionCookie	| Boolean | No | false | Use a secure cross-site session cookie. This allows the logs SDK to run when the site is loaded from another one (iframe). Implies useSecureSessionCookie.|

> Note: The Datadog Client Token is exposed in the client by design. While it is possible for someone to use the token to send false information, the risk is considered [limited](https://github.com/DataDog/browser-sdk/issues/853).

### Custom Logs

After the datadogLogs is initialized a default logger is created and will automatically send all console logs to Datadog. 

You can create custom logs using the following API:

```
logger.debug | info | warn | error (message: string, messageContext = Context)
```

Example custom log:
```
import { datadogLogs } from '@datadog/browser-logs'

datadogLogs.logger.info('Button clicked', { name: 'buttonName', id: 123 })
```


### Multiple Loggers

Datadog Logs automatically creates a default logger, but additional loggers can be created and defined by their `level`, `handler`, and `context`. 

```
createLogger (name: string, conf?: {
    level?: 'debug' | 'info' | 'warn' | 'error',
    handler?: 'http' | 'console' | 'silent',
    context?: Context
})
```

Once a Logger is created other components can use the custom loggers by importing `datadogLogs` and using the following API:
```
getLogger(name: string)
```

Example:

- Create Logger called `signupLogger`

```
import { datadogLogs } from '@datadog/browser-logs'

datadogLogs.createLogger('signupLogger', 'info', 'http', { env: 'staging' })
```
- Get `signupLogger` by using the API:
```
import { datadogLogs } from '@datadog/browser-logs'

const signupLogger = datadogLogs.getLogger('signupLogger')
signupLogger.info('Test sign up completed')
```


## Recommendation
For the moment, I implemented the default logger with a very broad scope. The current configuration reports all client side log levels - debug, info, warn, and errors - and sends the reports to both the console and Datadog.

I think we should create several loggers and use the `context` attribute to narrow the scope of the reporting based on the environment.

| Logger | Minimum Log Level | Handler(s) | Context |
| --- | --- | --- | --- |
| Default | Debug | console, http | { env: development } |
| Staging | Debug | console, http | { env: staging } |
| Production | Warn | http | { env: production } |

Grouping client side errors by environment would give us both the ability to interrogate client side reports at any level in the development process, and the ability to maintain a separate collection of real-time feedback derived from production that would be restricted to a more elevated threshold.

## References
- [Datadog Logs](https://docs.datadoghq.com/logs/log_collection/javascript/)
- [Exposed Client Token](https://github.com/DataDog/browser-sdk/issues/853)