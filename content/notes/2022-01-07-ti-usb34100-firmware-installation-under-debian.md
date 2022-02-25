---
title: TI USB3410 Firmware Installation Under Debian
date: 2022-01-07T07:05:22Z
tags: ["debian", "linux", "linux/firmware"]
---

When I plugged in a new external hard-drive from Western Digital (WD Elements) it wasn't detected by my operating system
(Debian Bookworm). A quick look at the kernel ring buffer with `dmesg` showed that the `ti_3410.fw` firmware couldn't be
found.

```bash
sudo dmesg
# ...
# [ 3159.384312] ti_usb_3410_5052 2-1:1.0: TI USB 3410 1 port adapter converter detected [ 3159.384336] usb 2-1: firmware:
# requesting ti_usb-v0451-pf430.fw [ 3159.391011] usb 2-1: firmware: requesting ti_3410.fw [ 3159.399203] usb 2-1:
# ti_download_firmware - firmware not found [ 3159.399240] ti_usb_3410_5052: probe of 2-1:1.0 failed with error -5 ...
```

Luckily, someone on StackExchange had the same [issue][unix.stackexchange.com:ti-usb3410] 10 Years ago and some was able
to provide a working solution. The firmware is packaged as an RPM for OpenSuSE as part of the [kernel-firmware
package][rpmfind.net:kernel-firmware]. To install the firmware on Debian the RPM needs to be downloaded, the cpio
archive extracted, unarchived and the firmware files installed.

```bash
# install rpm2cpio for extracting cpio archive
sudo apt install rpm2cpio

# download kernel-firmware package
curl -o kernel-firmware.rpm https://rpmfind.net/linux/opensuse/distribution/leap/15.4/repo/oss/noarch/kernel-firmware-20211123-150400.1.1.noarch.rpm

# extract cpio archive to firmware directory
mkdir kernel-firmware
rpm2cpio kernel-firmware.rpm | cpio -ivd -D kernel-firmware

# install ti_* firmware on system
sudo cp kernel-firmware/lib/firmware/ti_* /lib/firmware
```

[rpmfind.net:kernel-firmware]: https://rpmfind.net/linux/rpm2html/search.php?query=firmware%28ti_3410.fw%29
[unix.stackexchange.com:ti-usb3410]: https://unix.stackexchange.com/questions/16474/debian-and-ti-usb3410
