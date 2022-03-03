---
title: GitLab Runner /bin/sh Cannot Execute Binary File
date: 2022-02-23T13:43:14Z
draft: true
tags: ["docker", "gitlab-runner"]
---

```console
Executing "step_script" stage of the job script
Using docker image sha256:5926eb4c83e0bf6e74166605b2970e0383c57ddbba76fd0278ab04fa9dd669e6 for registry.example.com/example/example:latest with digest registry.example.com/example/example@sha256:5abb24fdf5bb8f47379d923ed5d9ad0026f8812d82b250f7d83d493401278231 ...
/bin/sh: /bin/sh: cannot execute binary file
```

inside the dockerfile

```diff
- ENTRYPOINT ["/bin/bash"]
+ ENTRYPOINT ["/bin/bash", "-l", "-c"]
```

https://github.com/dseg/node7-python2-pip-yarn-alpine35/issues/1
https://gitlab.com/gitlab-org/gitlab-runner/-/issues/2109
