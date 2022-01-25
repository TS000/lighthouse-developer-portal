#!/bin/sh
# cp /config/app-config.yaml /code/app-config.yaml

mv ../app-config.localdevcontainer.yaml app-config.local.yaml
yarn install

# rsync node_modules/* ../test/
yarn dev