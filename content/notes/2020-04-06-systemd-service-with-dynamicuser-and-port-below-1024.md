---
title: Systemd Service With DynamicUser and Port Below 1024
date: 2020-04-06T06:31:45
tags: ["linux", "linux/capabilities", "systemd", "systemd/service"]
---

When using a [`DynamicUser`][freedesktop.org:systemd:exec:dynamicuser], the processes user and group are allocated a
UID/GID between 61184 and 65519. For a non-root process (UID/GID 1) on linux to open ports below 1024 it needs to have
the `CAP_NET_BIND_SERVICE` [capability][man.debian.org:capabilities], which is usually not present in the execution
environment. Systemd allows adding capabilities using
[`AmbientCapabilites`][freedesktop.org:systemd:exec:ambientcapabilities] to the capability set.

```ini
[Service]
AmbientCapabilities=CAP_NET_BIND_SERVICE
DynamicUser=true
```

[freedesktop.org:systemd:exec:dynamicuser]:
  https://www.freedesktop.org/software/systemd/man/systemd.exec.html#DynamicUser=
[freedesktop.org:systemd:exec:ambientcapabilities]:
  https://www.freedesktop.org/software/systemd/man/systemd.exec.html#AmbientCapabilities=
[man.debian.org:capabilities]: https://manpages.debian.org/capabilities.7.en.html
