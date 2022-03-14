#!/bin/bash

# Commands run when Devcontainer starts up
yarn install --frozen-lockfile;
pre-commit install > start_up.log 2>&1;
pre-commit install --hook-type commit-msg >> start_up.log 2>&1;
git submodule update;