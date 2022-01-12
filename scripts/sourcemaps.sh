#!/bin/bash
RELEASE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
export DATADOG_API_KEY=$1

yarn datadog-ci sourcemaps upload ./packages/app/dist \
	--service=lighthouse-embark-app-sourcemaps \
	--release-version=$RELEASE_VERSION \
	--minified-path-prefix=https://dev.devportal.name/
