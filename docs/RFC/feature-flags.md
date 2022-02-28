# Feature Flags

## Summary

Feature flags are built upon conditional logic that control visibility of functionality for users at run time. In modern cloud-native systems, it's common to deploy new features into production early, but test them with a limited audience. As confidence increases, the feature can be incrementally rolled out to wider audiences.

## Background

Currently, the Lighthouse Developer Portal application has an internal feature-flag API. The flags are set by the user, and cannot be controlled by admins. These flags should be used to provide a more personalized experience for each user. A feature-flag application must be run alongside the Lighthouse developer portal in order to allow admins to toggle features for every user of the app. Feature-flags will allow admins to toggle new experimental features, or turn off app functionality if a bug is found, etc.

## Goal

Decide on a Feature-Flag service that will work well with the Lighthouse developer portal.

## Findings

### Unleash

https://github.com/Unleash/unleash

> Unleash is an open-source feature management platform. It provides a great overview of all feature toggles/flags across all your applications and services. Unleash enables software teams all over the world to take full control of how they enabled new functionality to end-users.

Setting up an Unleash instance is fairly easy. You just need to clone the [unleash-docker repo](https://github.com/Unleash/unleash-docker). Then, `cd` into the repo and run the following commands:

`docker-compose build`: Builds the docker images using the docker-compose file. This creates a `postgres` database, and the application as services.

`docker-compose run`: Runs the application. You should be able to view it on `localhost:4242`

Running the application this way will allow us to access feature-flags from our backend instance using one of the official [SDK's](https://docs.getunleash.io/sdks).

Accessing feature-flags from the frontend requires we also run a [proxy](https://docs.getunleash.io/sdks/unleash-proxy).

Using feature-flags within the Lighthouse developer portal is easy. Unleash provides an SDK that creates a react Context object, and a few hooks that allow us to check/toggle flags.

### Flagsmith

https://github.com/Flagsmith/flagsmith

> Flagsmith makes it easy to create and manage features flags across web, mobile, and server side applications. Just wrap a section of code with a flag, and then use Flagsmith to toggle that feature on or off for different environments, users or user segments.

They have an option for self-hosting with an example [docker-compose](https://github.com/Flagsmith/self-hosted/blob/master/docker-compose.yml) file. It was pretty easy to setup and run. The docker-compose file can also be adapted and included within our own docker-compose configuration.

It appears fairly simple to self-host.

Self Hosting Overview​

You will need to run through the following steps to get set up:

1. Create a Postgres database to store the Flagsmith data.
2. Deploy the API and set up DNS for it. If you are using health-checks, make sure to use /health as the health-check endpoint.
3. Visit http://<your-server-domain:8000>/api/v1/users/config/init/ to create an initial Superuser and provide DNS info to the platform.
4. Deploy the Front End Dashboard and set up DNS for it. Point the Dashboard to the API using the relevant Environment Variables. If you are using health-checks, make sure to use /health as the health-check endpoint.
5. Create a new Organisation, Project, Environment and Flags via the Dashboard.
6. When using our SDKs, you will need to override the API URL that they point to, otherwise they will default to connect to our paid-for API at https://api.flagsmith.com/api/v1. See the SDK documentation for the library you are using.

## Recommendation

Both Unleash and Flagsmith have similar functionality. The main difference comes from what's required to self-host the apps.

Unleash - 3 Containers

- The App
- The Database - Uses postgres
- A Proxy site - required to interact with feature flags from the front end

Flagsmith - 3 containers

- The Rest API
- The Frontend - Used to create accounts and manage flags. Once we've created an account and some flags, we can start using the API with one of the client SDKs
- The Database - Uses postgres

I'm leaning more towards Flagsmith for two reasons.

1. It doesn't require us to run a proxy server in order for React to communicate with the API.
2. We can use Flagsmith with only 2 containers. (API, Database) The frontend is only required to create an account, otherwise we can interact with the API from one of the client SDKs.

## References

### Unleash

[Unleash](https://github.com/Unleash/unleash)

[unleash-docker repo](https://github.com/Unleash/unleash-docker)

[unleash docker image](https://hub.docker.com/r/unleashorg/unleash-server/)

[Unleash SDKs](https://docs.getunleash.io/sdks)

[proxy](https://docs.getunleash.io/sdks/unleash-proxy)

### Flagsmith

[flagsmith](https://github.com/Flagsmith/flagsmith)

[docker-compose](https://github.com/Flagsmith/self-hosted/blob/master/docker-compose.yml)
