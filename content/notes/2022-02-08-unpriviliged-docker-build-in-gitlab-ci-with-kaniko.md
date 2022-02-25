---
title: Unprivileged Docker Build in GitLab CI With Kaniko
date: 2022-02-08T08:52:00Z
draft: true
tags: ["container", "container/image", "gitlab-ci", "gitlab-ci/job", "kaniko"]
---

```yaml
build:
  image:
    name: gcr.io/kaniko-project/executor:debug
    entrypoint: [""]
  variables:
    docker_dir: ./docker
  script:
    - |
      echo "{ \"auths\" : { \"${CI_REGISTRY}\" : {
        \"username\" : \"${CI_REGISTRY_USER}\",
        \"password\" : \"${CI_REGISTRY_PASSWORD}\"
      }}}" > /kaniko/.docker/config.json
    - |
      /kaniko/executor \
      --context ${CI_PROJECT_DIR} \
      --dockerfile ${CI_PROJECT_DIR}/${docker_dir}/${docker_image}/Dockerfile \
      --destination ${CI_REGISTRY_IMAGE}/${docker_image}:${CI_COMMIT_REF_SLUG}
  rules:
    - changes:
        - ${docker_dir}/**/*
```
