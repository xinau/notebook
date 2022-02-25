---
title: Suppress A Single Alerts in Alertmanager
date: 2020-05-02T16:45:37Z
tags: ["alerting", "alerting/fatigue", "alertmanager", "alertmanager/inhibition", "prometheus"]
---

It's not always possible to modify alerting rules of a Prometheus instance, as they're provided by a third-party like
the _prometheus-operator_ helm chart. This can lead to alerting fatigue where users are paged for false positive alerts.

One could deduce from the alertmanager [documentation][prometheus.io:alerting:configuration:inhibit-rule] that it's
possible to write an inhibition rule which can be used to suppress a specific alert.

> An inhibition rule mutes an alert (target) matching a set of matchers when an alert (source) exists that matches
> another set of matchers. Both target and source alerts must have the same label values for the label names in the
> equal list.

But due to a [change][github.com:prometheus:alertmanager:pull:1017] it's impossible for alerts to inhibit themselves
anymore.

These alerts can still be prevented from being paged by routing them to a dedicated blackhole receiver. Even though the
alertmanager [documentation][prometheus.io:alerting:configuration:receiver] doesn't mention the ability to configure a
receiver that sends alerts to no destination. It can be configured by only setting the `name` attribute of a receiver's
configuration (see [prometheus/alertmanager#428][github.com:prometheus:alertmanager:issues:428])

```yaml
route:
  routes:
    - receiver: blackhole
      match_re:
        alertname: CPUThrottlingHigh
        container: config-reloader

receiver:
  - name: blackhole
    # other fields emitted to prevent sending alerts
```

[github.com:prometheus:alertmanager:issues:428]: https://github.com/prometheus/alertmanager/issues/428
[github.com:prometheus:alertmanager:pull:1017]: https://github.com/prometheus/alertmanager/pull/1017
[prometheus.io:alerting:configuration:inhibit-rule]: https://prometheus.io/docs/alerting/configuration/#inhibit_rule
[prometheus.io:alerting:configuration:receiver]: https://prometheus.io/docs/alerting/configuration/#receiver
