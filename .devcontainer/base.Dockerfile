#-------------------------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See https://go.microsoft.com/fwlink/?linkid=2090316 for license information.
#-------------------------------------------------------------------------------------------------------------
ARG VARIANT="bullseye"
FROM buildpack-deps:${VARIANT}-curl

ARG USERNAME=codespace
ARG USER_UID=1000
ARG USER_GID=$USER_UID
ARG HOMEDIR=/home/$USERNAME
RUN groupadd -g 1000 ${USERNAME}
RUN useradd -u 1000 -g ${USERNAME} ${USERNAME}
RUN mkdir /home/${USERNAME} \
    && chown -R ${USERNAME}:${USERNAME} /home/${USERNAME}/

# Default to bash shell (other shells available at /usr/bin/fish and /usr/bin/zsh)
ENV SHELL=/bin/bash \
    NODE_ROOT="${HOMEDIR}/.nodejs" \
    NVM_SYMLINK_CURRENT=true \
    NPM_GLOBAL="/home/${USERNAME}/.npm-global" \
    NPM="/home/${USERNAME}/.npm" \
    NODE="/home/${USERNAME}/.nodejs" \
    DOCKER_BUILDKIT=1

ENV PATH="${NVM_DIR}/current/bin:${NPM_GLOBAL}/bin:${PATH}:${NODE_ROOT}/current/bin:${NPM}/bin:${NODE}/bin"

# Install needed utilities and setup non-root user. Use a separate RUN statement to add your own dependencies.
COPY library-scripts/* /tmp/scripts/
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && bash /tmp/scripts/common-debian.sh "true" "${USERNAME}" "${USER_UID}" "${USER_GID}" "true" "true" "true" \
    && apt-get -y install cmake
RUN bash /tmp/scripts/setup-user.sh "${USERNAME}" "${PATH}" \
    && chsh -s /bin/bash ${USERNAME} \
    && bash /tmp/scripts/sshd-debian.sh
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y nodejs
RUN bash /tmp/scripts/git-lfs-debian.sh \
    && bash /tmp/scripts/github-debian.sh \
    # Install Moby CLI and Engine
    && bash /tmp/scripts/docker-in-docker-debian.sh "true" "${USERNAME}" "true" \
    && bash /tmp/scripts/kubectl-helm-debian.sh \
    # Build latest git from source
    && bash /tmp/scripts/git-from-src-debian.sh "latest" \
    # Clean up
    && apt-get autoremove -y && apt-get clean -y \
    # Move first run notice to right spot
    && mkdir -p /usr/local/etc/vscode-dev-containers/ \
    && mv -f /tmp/scripts/first-run-notice.txt /usr/local/etc/vscode-dev-containers/

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor > /usr/share/keyrings/yarn-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/yarn-archive-keyring.gpg] https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list \
    && apt-get update \
    && apt-get -y install --no-install-recommends yarn python3-pip \
    && pip3 install pre-commit

RUN bash /tmp/scripts/go-debian.sh "latest" "${GOROOT}" "${GOPATH}" "${USERNAME}" \
    && apt-get clean -y && rm -rf /tmp/scripts
RUN curl -s "https://raw.githubusercontent.com/kubernetes-sigs/kustomize/master/hack/install_kustomize.sh"  | bash \
    && mv kustomize /usr/bin
RUN cp /usr/local/go/bin/go /usr/bin 

# Mount for docker-in-docker
VOLUME [ "/var/lib/docker" ]

# Fire Docker/Moby script
ENTRYPOINT [ "/usr/local/share/docker-init.sh", "/usr/local/share/ssh-init.sh" ]
CMD [ "sleep", "infinity" ]

USER ${USERNAME}