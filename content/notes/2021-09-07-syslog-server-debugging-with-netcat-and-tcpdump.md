---
title: Syslog Server Debugging With Netcat and Tcpdump
date: 2021-09-07T05:53:59Z
draft: true
tags: ["netcat", "syslog", "tcpdump"]
---

on the syslog client

```bash
nc syslog.example.com 514 -u -w 1 <<< "<14>$(hostname) testing"
```

on the syslog host

```bash
sudo tcpdump -i any -n udp port 514 -vvv | grep testing
# tcpdump: listening on any, link-type EN10MB (Ethernet), capture size 262144 bytes
#         Msg: client.example.com testing\0x0a
#         Msg: client.example.com testing\0x0a
#         ...
```
