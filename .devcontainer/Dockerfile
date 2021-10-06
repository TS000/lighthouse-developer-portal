# Pulls image used by Codespaces to build our devcontainer
# Image is created by building base.Dockerfile locally and then the image is pushed to GitHub packages
# - https://github.com/department-of-veterans-affairs/lighthouse-backstage/pkgs/container/lighthouse-backstage%2Fdevcontainer
FROM ghcr.io/department-of-veterans-affairs/lighthouse-backstage/devcontainer:latest
USER root
RUN cp /usr/local/go/bin/go /usr/bin 
USER codespace
