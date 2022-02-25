---
title: Graceful Shutdown of a GitLab CI Runner With SystemD
date: 2020-04-05T00:25:41Z
tags: ["gitlab-ci", "gitlab-ci/runner", "systemd", "systemd/service"]
---

The gitlab-runner systemd service from the official GitLab CI runner package performs a _force shutdown_ when stopping
the service by sending a `TERM` signal to the gitlab-runner process. This results in the immediate termination of all
running build jobs. This behavior can be changed to a _graceful shutdown_ by sending a `QUIT` signal as the [service
kill signal][freedesktop.org:systemd:kill:signal] (`KillSignal`) instead.

By default systemd has a stop timeout of 2 minutes configured before a `TERM` signal is send to the to be stopped
service . This means that build jobs that haven't finished after 2 minutes are still be terminated. This [stop
timeout][freedesktop.org:systemd:service:timeout] can be changed through the `TimoutStopSec` setting to something more
sensible. The default gitlab-runner job timeout is 2 hours.

```ini
[Service]
KillSignal=SIGQUIT
TimeoutStopSec=2h
```

[freedesktop.org:systemd:kill:signal]: https://www.freedesktop.org/software/systemd/man/systemd.kill.html#KillSignal=
[freedesktop.org:systemd:service:timeout]:
  https://www.freedesktop.org/software/systemd/man/systemd.service.html#TimeoutStopSec=
[gitlab.com:runner:signals]: https://docs.gitlab.com/runner/commands/#signals
