---
title: DigitalOcean Monitoring Agent on Flatcar Linux
date: 2022-05-18T23:29:00Z
draft: true 
tags: ["digitalocean", "flatcar", "monitoring"]
---

```console
digitalocean_droplet.main: Creating...
╷
│ Error: Error creating droplet: POST https://api.digitalocean.com/v2/droplets: 422 (request "a23015e4-f60a-4b52-80cf-868ce5faa415") Monitoring is not supported for this configuration, please try a different region or distribution.
│ 
│   with digitalocean_droplet.main,
│   on main.tf line 31, in resource "digitalocean_droplet" "main":
│   31: resource "digitalocean_droplet" "main" {
│ 
╵
```

Custom Images don't support setting the monitoring-agent flag via droplet.

> You cannot enable monitoring automatically during Droplet creation when using a custom image. Instead, enable monitoring manually.

https://docs.digitalocean.com/products/images/custom-images/#Limits

Instead one needs to install the monitoring agent manually. packages are provided for deb and rpm as well as a container image. 

https://github.com/digitalocean/do-agent#run-as-a-docker-container

```bash
docker run \
        -v /proc:/host/proc:ro \
        -v /sys:/host/sys:ro \
        digitalocean/do-agent:stable
```

```yaml
systemd:
  units:
    - name: do-agent.service
      enabled: true
      contents: |
        [Unit]
        Description=DigitalOcean Monitoring Agent
        Requires=docker.service
        After=docker.service
        After=network-online.target
        Wants=network-online.target

        [Service]
        Restart=always
        ExecStartPre=-/usr/bin/docker stop do-agent
        ExecStartPre=-/usr/bin/docker rm do-agent
        ExecStartPre=/usr/bin/docker pull digitalocean/do-agent:stable
        ExecStart=/usr/bin/docker run \
            --name do-agent \
            -v /proc:/host/proc:ro \
            -v /sys:/host/sys:ro \
            digitalocean/do-agent:stable

        [Install]
        WantedBy=multi-user.target
```


