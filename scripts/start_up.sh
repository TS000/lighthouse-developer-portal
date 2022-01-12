#!/bin/bash

# Commands run when Devcontainer starts up
yarn install --frozen-lockfile;
cd /workspaces/lighthouse-embark && pre-commit > start_up.log 2>&1;
exit 0;
