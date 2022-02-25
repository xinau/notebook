---
title: GitLab Issue Triage for Moved Issues
date: 2022-02-11T17:49:59Z
tags: ["gitlab", "gitlab/triage"]
---

When moving an issue in GitLab to a new Project, the original issue is closed and a new issue is opened. This means that
issues that these issues might be reopened for an unwanted reason. The GitLab Triage Project doesn’t directly support
[checking][rubydoc.info:gitlab-triage:conditions-field] if an issue has been moved. This workaround for this is to check
if the [issue resource][docs.gitlab.com:api:issues] has a field `moved_to_id` that's neither nil nor zero.

```yaml
resource_rules:
  issues:
    rules:
      - name: Closed issues that haven't been moved
        conditions:
          ruby: |
            moved_to_id = resource[:moved_to_id]
            moved_to_id.nil? || moved_to_id.nonzero?
```

[rubydoc.info:gitlab-triage:conditions-field]: https://www.rubydoc.info/gems/gitlab-triage#conditions-field
[docs.gitlab.com:api:issues]: https://docs.gitlab.com/ee/api/issues.html#single-issue
