---
title: OpsGenie Priority Based On Alertmanager Alert Severity
date: 2022-02-25T19:28:06Z
draft: true
tags: ["alertmanager", "alertmanager/receiver", "opsgenie"]
---

```yaml
receivers:
- name: opsgenie
  opsgenie_configs:
  - priority: >-
      {{ with .CommonLabels }}
      {{- if eq .severity "critical" -}} P2
      {{- else if eq .severity "warning" -}} P3
      {{- else if eq .severity "info" -}} P5
      {{- else -}} P3
      {{- end }}
      {{- end }}
```
