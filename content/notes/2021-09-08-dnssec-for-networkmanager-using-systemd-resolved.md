---
title: DNSSEC for NetworkManager Using systemd-resolved
date: 2021-09-08T15:35:40Z
tags: ["dns", "dns/dnssec", "networkmanager", "systemd", "systemd/resolved"]
---

The default DNS backend used by NetworkManager doesn't seem to support DNSSSEC. To get DNSSEC for NetworkManager the
[DNS backend][wiki.gnome.org:networkmanager:dns] needs to be changed to a different service (`dnsmasq` or
`systemd-resolved`). This is done with the `dns` field inside the `main` section inside
_/etc/NetworkManager/NetworkManager.conf_.

```ini
[main]
dns=systemd-resolved
```

The NetworkManager changes can than be reloaded using `sudo nmcli general reload`. On some systems like Debian
_/etc/resolve.conf_ needs to be deleted first and a symlinked to systemd-resolved's _resolve.conf_ for this to take
effect.

```bash
sudo rm /etc/resolv.conf
sudo ln -s /run/systemd/resolve/resolv.conf /etc/resolv.conf
sudo nmcli general reload
```

DNSSEC for systemd-resolved is enabled by setting the `DNSSEC` field under the `Resolve` section inside
_/etc/systemd/resolved.conf_ to `true`.

```ini
[Resolve]
DNSSEC=true
```

For this to take effect systemd-resolved needs to be restarted with `sudo systemctl restart systemd-resolved`.

DNSSEC support can be verified using `dig` as follows.

```bash
dig www.dnssec-deployment.org | grep status
# ;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 59040
dig www.dnssec-failed.org | grep status
# ;; ->>HEADER<<- opcode: QUERY, status: SERVFAIL, id: 34764
```

[wiki.gnome.org:networkmanager:dns]: https://wiki.gnome.org/Projects/NetworkManager/DNS
