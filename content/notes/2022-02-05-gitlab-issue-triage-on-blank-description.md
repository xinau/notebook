---
title: GitLab Issue Triage on Blank Description
date: 2022-02-05T11:02:51Z
tags: ["gitlab", "gitlab/triage"]
---

Even though the GitLab Triage Project doesn’t have a [condition][rubydoc.info:gitlab-triage:condition] to check if issue
or merge request description is blank, it’s still possible to triage these using a [ruby
condition][rubydoc.info:gitlab-triage:ruby-expression] as follows

```yaml
resource_rules:
  issues:
    rules:
      - name: Action when issue description is blank
        conditions:
          ruby: |
            resource[:description].blank?
```

[rubydoc.info:gitlab-triage:conditions-field]: https://www.rubydoc.info/gems/gitlab-triage#conditions-field
[rubydoc.info:gitlab-triage:ruby-condition]: https://www.rubydoc.info/gems/gitlab-triage#ruby-condition
