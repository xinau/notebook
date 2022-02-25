---
title: Unattended-Upgrades on OpenWrt
date: 2021-05-14T22:07:24Z
tags: ["openwrt", "opkg", "unattended-upgrades"]
---

The [OpenWrt documentation][openwrt.org:docs:opkg] mentions why for `opkg upgrade` it's impossible to update all
additional software with a single statement due to the potential lack of available space in the read-write partition.
This means that to keep packages up-to-date an administrator needs to check the list of upgradable packages and update
each package individually on a constant basis.

> Since OpenWrt firmware stores the base system in a compressed read-only partition, any update to base system packages
> will be written in the read-write partition and therefore use more space than it would if it was just overwriting the
> older version in the compressed base system partition. It's recommended to check the available space in internal flash
> memory, and the space requirements for updates of base system packages.

This lack of available space is often the case with smaller embedded devices. It should, therefore not be a problem to
perform unattended-upgrades on larger routers with more space available. This is done by creating an unattended-upgrades
script and adding a crontab entry. **Use at your own risk.**

The script updates the opkg package lists, upgrades all upgradable packages and reboots after a successful upgrade.

```bash
#!/bin/sh
#
# unattended-upgrades updates the opkg package lists, upgrades all
# upgradable packages and performs a reboot after a successful upgrade.
#
# Usage: /usr/local/bin/unattended-upgrades

alias log="logger -t unattended-upgrades"

opkg update

# upgrade netifd first as it causes drop out and system upgrade fails
opkg upgrade netifd
if [ $? -ne 0 ]; then
    log -p 2 "package uprade failed"
    exit 1
fi

packages=$(opkg list-upgradable | awk '{print $1}')
if [ -n "$packages" ]; then
    log "performing upgrade of $packages"
    opkg upgrade $packages
    if [ $? -eq 0 ]; then
        log -p 1 "package uprade successful, rebooting"
        exec reboot
    else
        log -p 2 "package uprade failed"
        exit 1
    fi
else
    log "no packages to upgrade"
fi
```

To have the script run at a regular interval an entry needs to be added to the crontab using `crontab -e`.

```
0 4 * * * /usr/local/bin/unattended-upgrades
```

[openwrt.org:docs:opkg]: https://openwrt.org/docs/guide-user/additional-software/opkg
