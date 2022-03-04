---
title: Make GitLab CI Direct Acyclic Graph Depend on Stages
date: 2022-03-04T13:12:30Z
draft: true
tags: ["gitlab-ci", "gitlab-ci/dag"]
---

> A directed acyclic graph can be used in the context of a CI/CD pipeline to build relationships between jobs such that
> execution is performed in the quickest possible manner, regardless how stages may be set up.

```yaml
build:
  stage: build
  script: echo "building"

test:e2e:
  stage: test
  script: echo "testing e2e"
  rules:
  - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH

deploy:
  stage: deploy
  needs:
  - job: test:e2e
    optional: true
  script: echo "deploying"
```

```diff

+ deploy:init:
+   stage: deploy
+   script: exit 0

deploy:linux:
  stage: deploy
  needs:
  - job: test:linux
    optional: true
+ - job: deploy:init
  script: echo "deploying linux"
```

https://docs.gitlab.com/ee/ci/directed_acyclic_graph/
https://about.gitlab.com/blog/2021/05/20/dag-manual-fix/
