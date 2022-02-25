---
title: Transform Variables in Ansible With Jinja2
date: 2021-09-09T06:55:47Z
draft: true
tags: ["ansible", "ansible/jinja2"]
---

This is an example for a Prometheus scrape_config where the targets are statically configured. The value for `targets`
is being transformed from the list of hosts in the group `prometheus` and appending a port to each host.

```yaml
scrape_configs:
  - job_name: "prometheus"
    static_configs:
      - targets: >
          {%- set args = [] %} {%- for host in groups["prometheus"] | default([]) %} {%-   set args = args.append( host
          + ":9090" ) %} {%- endfor %} {{- args -}}
```
