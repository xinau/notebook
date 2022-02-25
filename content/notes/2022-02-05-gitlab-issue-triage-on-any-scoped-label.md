---
title: GitLab Issue Triage on Any Scoped Label
date: 2022-02-05T11:33:46Z
tags: ["gitlab", "gitlab/triage"]
---

The GitLab Triage Project doesn’t directly support performing an action on any scoped label without having to list all
label scopes in the [condition][rubydoc.info:gitlab-triage:conditions-field]. This issue can be worked around by using
the [ruby condition][rubydoc.info:gitlab-triage:ruby-condition] and checking if any label exists that matches
`/^<label>::.+$/` as shown below.

```yaml
resource_rules:
  issues:
    rules:
      - name: Action for any severity label scope
        conditions:
          ruby: |
            resource[:labels].grep(/^severity::.+$/).any?
```

[rubydoc.info:gitlab-triage:conditions-field]: https://www.rubydoc.info/gems/gitlab-triage#conditions-field
[rubydoc.info:gitlab-triage:ruby-condition]: https://www.rubydoc.info/gems/gitlab-triage#ruby-condition
