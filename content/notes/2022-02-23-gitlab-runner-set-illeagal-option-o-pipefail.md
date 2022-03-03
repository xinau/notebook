---
title: GitLab Runner Set Illeagal Option -o pipefail
date: 2022-02-23T13:52:55Z
draft: true
tags: ["docker", "gitlab-runner"]
---

```diff
FROM debian:buster

- ENTRYPOINT ["/bin/bash", "-l", "-c"]
+ ENTRYPOINT []
```

```
Executing "step_script" stage of the job script 
Using docker image sha256:4e1b9c0579e157f225a4e1c6de6ce9ff224ec576a774541da86543b258554be4 for registry.example.com/example/example:latest with digest registry.example.com/example/example@sha256:87a8a2dc4fb6ef99ddab7ffe2c939eef0c421ecca504700ec5eea85fc1a501ba ...
sh: 3: set: Illegal option -o pipefail
```

https://gitlab.com/gitlab-org/gitlab-runner/-/issues/1170

[[2022-02-23-gitlab-runner-bin-sh-cannot execute-binary-file]]  
[[2022-02-08-debian-dockerfile-set-pipefail]]
