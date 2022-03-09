---
title: Debian Dockerfile Set Pipefail
date: 2022-02-08T11:46:08Z
tags: ["debian", "container", "container/dockerfile", "container/podman"]
---

A best-practice in Dockerfile's is
[to use pipefail](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#using-pipes) when commands
pipe output of on into another as this ensures that an unexpected error prevents the build from inadvertently
succeeding.

Not all shells such as the `dash` shell on Debian-based images don't support the `-o pipefail` option, therefore it
should be considered to choose a different shell. This can be either done inside the `RUN` instruction or via `SHELL`
globally.

```dockerfile
FROM debian:latest

RUN ["/bin/bash", "-c", "set -o pipefail && echo \"pipefail\" | false; true"]
```

```dockerfile
FROM debian:latest

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN echo "pipefail" | false; true
```

When using podman images need to be build with `--format docker` argument, as the `SHELL` instruction is not part of the
OCI image specification. See [containers/buildah#507](https://github.com/containers/buildah/issues/507) and
[containers/podman#8477](https://github.com/containers/podman/issues/8477).

```bash
podman build .
# STEP 1/3: FROM debian:buster
# STEP 2/3: SHELL ["/bin/bash", "-o pipefail"]
# --> Using cache 32c10fe9f242ee2bd04a609c584930e0b649661a8cdb46cabc6c9ac9c72a55ae
# --> 32c10fe9f24
# STEP 3/3: RUN echo "pipefail" | false; true
# COMMIT
# WARN[0000] SHELL is not supported for OCI image format, [/bin/bash -o pipefail] will be ignored. Must use `docker` format
# --> 7c03fa37bcd
# 7c03fa37bcde083c8932f520b58bf8a7c39e38311bfa06fd8fee1668f6e88941

podman build . --format docker
# STEP 1/3: FROM debian:buster
# STEP 2/3: SHELL ["/bin/bash", "-o pipefail"]
# --> Using cache f9b0a46c87fa2839d53a54ac8c2f1878662b96b73f433043b07b00809b952ffa
# --> f9b0a46c87f
# STEP 3/3: RUN echo "pipefail" | false; true
# /bin/bash: line 0: /bin/bash: echo "pipefail" | false; true: invalid option name
# Error: error building at STEP "RUN echo "pipefail" | false; true": error while running runtime: exit status 2
```
