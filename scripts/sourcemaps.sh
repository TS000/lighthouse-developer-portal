#!/bin/bash
RELEASE_VERSION=$(cat package.json | grep version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
export DATADOG_API_KEY=$1
BASE_URL=${2:-"http://internal-a4d95ec490108442a940e05e10d9e3d7-665278146.us-gov-west-1.elb.amazonaws.com"}

yarn datadog-ci sourcemaps upload ./packages/app/dist \
	--service=lighthouse-developer-portal-app-sourcemaps \
	--release-version=$RELEASE_VERSION \
	--minified-path-prefix=$BASE_URL
