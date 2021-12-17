import { datadogLogs, LogsInitConfiguration } from '@datadog/browser-logs';

// The Datadog Client Token is public by design
const DATADOG_CLIENT_TOKEN = 'pubbf62a963793d35e68abaa2178a77b4aa';
const DATADOG_SITE = 'datadoghq.com';

function getLoggerConfig(): LogsInitConfiguration {
    const initConfig: LogsInitConfiguration = {
        clientToken: DATADOG_CLIENT_TOKEN,
        site: DATADOG_SITE,
        env: process.env.NODE_ENV,
        forwardErrorsToLogs: true,
        service: 'lighthouse-embark-browser-logger',
        sampleRate: 100,
        beforeSend: (log) => {
            // Example of filtering email from browser logs
            // Here are other fields that could potentially contain sensitive information
            // Field            Type        Description
            // view.url	        String	    The URL of the active web page.
            // view.referrer	String	    The URL of the previous web page from which a link to the currently requested page was followed.
            // message	        String	    The content of the log.
            // error.stack	    String	    The stack trace or complementary information about the error.
            // http.url	        String	    The HTTP URL.
            log.view.url = log.view.url.replace(/email=[^&]*/, "email=REDACTED")
        }
    };
    return initConfig;
};

export function initDatadogLogs(): void {
    datadogLogs.init(getLoggerConfig());
    // This log can be viewed on Datadog
    datadogLogs.logger.debug('Datadog Logs initialized Successfully');
    // Sets the threshold for the minimum log level
    // The log levels escalate from 'debug' -> 'info' -> 'warn' -> 'error'
    datadogLogs.logger.setLevel('debug');
    // Sets the destination of the messages
    // http: Messages are sent to Datadog
    // console: Messages are sent to console
    // silent: Messages are not sent
    // setHandler (handler?: 'http' | 'console' | 'silent' | Array<handler>)
    datadogLogs.logger.setHandler(['http', 'console']);
}
