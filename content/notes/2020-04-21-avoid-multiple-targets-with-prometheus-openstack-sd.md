---
title: Avoid Multiple Targets With Prometheus OpenStack SD
date: 2020-04-21T13:51:12Z
tags: ["openstack", "prometheus", "prometheus/servicediscovery"]
---

Prometheus [OpenStack service discovery][prometheus.io:configuration:openstack-sd] generates one target per network
interface.

> The instance role discovers one target per network interface of Nova instance. The target address defaults to the
> private IP address of the network interface.

Meaning that by default an instance with multiple network interfaces is going to be scraped multiple times on different
networks interfaces. This can be avoided by comparing the `__meta_openstack_address_pool` label against a custom
metadata tag specifying the network name of the desired network interface. I.e.

```yaml
- job_name: "node_exporter"
  openstack_sd_configs: ...
  relabel_configs:
    - source_labels: [__meta_openstack_instance_status]
      action: keep
      regex: "ACTIVE"

    - source_labels: [__meta_openstack_tag_prometheus_node_exporter_scrape]
      action: keep
      regex: "true"

    - source_labels: [__meta_openstack_tag_prometheus_node_exporter_network, __meta_openstack_address_pool]
      separator: ""
      regex: ((networkA){2}|(networkB){2})
      action: keep

    - source_labels: [__address__, __meta_openstack_tag_prometheus_node_exporter_port]
      action: replace
      regex: ([^:]+)(?::\d+)?;(\d+)
      replacement: $1:$2
      target_label: __address__

    - source_labels: [__meta_openstack_instance_name]
      target_label: instance
```

For this to work each network must be added to the address pool [relabel
rule][prometheus.io:configuration:relabel-config] regex.

A more general approach using a backreference like `(\w+);\1` won't work as Prometheus uses RE2 as regex engine which
[doesn't support backreferences][github.com:google:re2:syntax].

[prometheus.io:configuration:openstack-sd]:
  https://prometheus.io/docs/prometheus/latest/configuration/configuration/#openstack_sd_config
[prometheus.io:configuration:relabel-config]:
  https://prometheus.io/docs/prometheus/latest/configuration/configuration/#relabel_config
[github.com:google:re2:syntax]: https://github.com/google/re2/wiki/Syntax
