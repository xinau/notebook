---
title: DigitalOcean Metrics Agent on Flatcar Linux
date: 2022-05-18T23:29:00Z
tags: ["digitalocean", "flatcar", "monitoring"]
---

DigitalOcean Monitoring can be used for gathering metrics about Droplet-level
resource utilization. The metrics are gathered by the DigitalOcean Metrics
Agent runnig on each Droplet.

For DigitalOcean provided Droplet images the agent can be installed during
Droplet creation automatically through the UI or an API flag. This isn't
possible when using a [custom
image][docs.digitalocean.com:images:custom-images:limits] like Flatcar Linux,
instead the agent has to be installed manually. On Flatcar Linux this can be
done by running the [agent as a
container][github.com:digitalocean:do-agent:docker].

The following is a Butane configuration snippet for a systemd unit.

```yaml
systemd:
  units:
    - name: do-agent.service
      enabled: true
      contents: |
        [Unit]
        Description=DigitalOcean Metrics Agent
        Requires=docker.service
        After=docker.service
        After=network-online.target
        Wants=network-online.target

        [Service]
        ExecStartPre=-/usr/bin/docker rm --force do-agent
        ExecStart=/usr/bin/docker run \
          --name do-agent \
          --pull always \
          --volume /proc:/host/proc:ro \
          --volume /sys:/host/sys:ro \
          digitalocean/do-agent:stable
        ExecStop=/usr/bin/docker stop do-agent
        Restart=always
        RestartSec=5s
        TimeoutStartSec=0


        [Install]
        WantedBy=multi-user.target
```

[docs.digitalocean.com:images:custom-images:limits]:
  https://docs.digitalocean.com/products/images/custom-images/#Limits
[github.com:digitalocean:do-agent:docker]:
  https://github.com/digitalocean/do-agent#run-as-a-docker-container
