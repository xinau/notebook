---
title: mtail as a Logging-Agent in Kubernetes
date: 2020-04-08T14:32:52Z
tags: ["kubernetes", "kubernetes/logging", "observability", "observability/logging", "observability/monitoring", "mtail"]
---

The [mtail][github.com:google:mtail] project focuses on extracting metrics from application logs to be ingested into a
timeseries database like Prometheus. mtail does this by using a set of user-defined extraction programs reading from
specified log files, named pipes or UNIX sockets. It's intended to run one mtail per machine serving multiple
applications.

Kubernetes has a documentation page describing it's [logging
architecture][kubernetes.io:cluster-administration:logging]. All system components (kubelet, containerd) which aren't
running as containers write their logs if systemd is present to journald else in a log file under `/var/log`. The
documentation mentions two configurations to apply a logging-agent like mtail.

- As a side-car to the application, where logs are being shared through a _emptyDir_
  [volume][kubernetes.io:storage:volumes:emptydir].

- As a node-level logging agent using a DaemonSet and access to the nodes log directories using a _hostPath_
  [volume][kubernetes.io:storage:volumes:hostpath].

Kubernetes exposes container logs at `/var/log/containers` these logs might be symlinks to a different directory like
`/var/lib/docker/containers`. Therefore, the symlinked directory must be made available through a volume mount to the
logging-agent as well.

An example of mtail being configured as a logging-agent using a DaemonSet can be found on this [GitHub
Gist][gist.github.com:xinau:d8d3bdd].

[github.com:google:mtail]: https://github.com/google/mtail
[gist.github.com:xinau:d8d3bdd]: https://gist.github.com/xinau/d8d3bdd7b9dcfebd6e7aa2271c9ed171
[kubernetes.io:cluster-administration:logging]: https://kubernetes.io/docs/concepts/cluster-administration/logging/
[kubernetes.io:storage:volumes:emptydir]: https://kubernetes.io/docs/concepts/storage/volumes/#emptydir
[kubernetes.io:storage:volumes:hostpath]: https://kubernetes.io/docs/concepts/storage/volumes/#hostpath
