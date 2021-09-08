#!/bin/bash
DIR="/workspaces/lighthouse-backstage/.pulumidevcontainer/"
if [ -d "$DIR" ]; then
  # Take action if $DIR exists. #
  echo -e "Switching Codespace configuration to install Minikube...\nPlease rebuild container"
  mv ./.devcontainer ./.devcontainer_main
  cp -r ./.pulumidevcontainer /tmp
  cp -r /tmp/.pulumidevcontainer/ ./.devcontainer &&  rm -rf /tmp/.pulumidevcontainer/ && rm -rf ./.pulumidevcontainer
else
  echo -e "Switching Codespace configuration to original .devcontainer\nPlease rebuild container"
  mv ./.devcontainer ./.pulumidevcontainer && mv ./.devcontainer_main ./.devcontainer
fi
