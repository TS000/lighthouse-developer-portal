# Environment Promotion Process

**Summary**:
We want to determine a set of promotion criteria that can be applied to our application to ensure code meets a certain standard before being deployed to the production environment.

## Background

Part of our CI/CD process involves testing our application in a series of environments to validate that our application

## Goal

Ensure that our application must meet a set of requirements before it is deemed fit to deploy to the production environment.

We want to validate that the:

- Application's deployment mechanism functions correctly
- Application is bug/error free and performs all of its functions as intended
- Application responds appropriately to stress testing

> Note: Do we need more things to validate? What else will ensure the code is production ready?

## Environments

### Sandbox Environment

This is a testing environment that will only be deployed to using a manual process.

### Dev Environment

For our CI/CD pipeline, the Development environment is the first environment the application will be deployed to. One of the main purposes of this stage is to validate our deployment mechanism. Successfully deploying to this environment is the first step to ensuring that we are able to deploy to any subsequent environment and ultimately our production environment. The other main purpose of this environment is to validate that the application is bug/error free and that the application is functioning as intended. Here we can implement most of our testing, like browser tests, integration tests, regression testing, database testing, etc. to ensure that the application meets a certain requirement before being promoted to the next stage.

### QA Environment

QA is the final environment before code can be promoted to a Production environment. The QA environment provides the opportunity to run any additional tests in an as-close-to-production environment as possible. At this stage we can implement performance and load testing for our application. The purpose of these tests is to validate the reliability, scalability, and resource usage of our application.

> Note: Typically, more resources are allocated for a production environment than a non-production so it is important to take that into consideration when conducting performance and load testing in a non-production environment.

### Production

Final Stage in the code promotion process. At this point, all of our changes are live and customers can interact with our application.

## Recommendations

### Use a single build for every environment

We can modify `app-config.yaml` to use variables so a single image can be re-used to deploy to multiple environments. This way we do not have to spend time or resources rebuilding the image when promoting from one environment to the next. This also eliminates the possibility of producing a build, at some point in the pipeline, that differs from the original build that was created at the start of the pipeline. We need to be able to ensure that the product we have thoroughly tested is also the same product we deliver.

<pre>
# Example app-config.yaml
app:
  title: Embark Developer Portal
  baseUrl: <b>${FE_ENDPOINT}</b>

organization:
  name: Embark

backend:
  baseUrl: <b>${BE_ENDPOINT}</b>
  listen:
    port: <b>${BE_LISTEN_PORT}</b>
  csp:
    connect-src: ["'self'", 'http:', 'https:']
  cors:
    origin: <b>${FE_ENDPOINT}</b>
    methods: [GET, POST, PUT, DELETE]
    credentials: true
  cache:
    store: memory
  database:
    client: pg
    connection:
      host: <b>${DB_HOST}</b>
      port: <b>${DB_PORT}</b> 
      user: <b>${DB_USER}</b> 
      password: <b>${DB_PASSWORD}</b> 
...
</pre>
