---
title: Ubuntu Installation on an APU Board
date: 2020-04-26T14:35:12Z
tags: ["apuboard", "ubuntu"]
---

When trying to install the official Ubuntu 20.04 LTS Live server image from a USB stick on an [APU
board][www.apu-borad.de] the following error is emitted. This seems to come from the fact that the APU board only
provides a serial port.

```terminfo
graphics initialization failed
Error setting up gfxboot
boot:
```

A quick online search suggests using the network installer `mini.iso` from the [alternative downloads
page][ubuntu.com:download:alternative] needs to instead.

Till Ubuntu 19.10 only the kernel boot parameters need to be changed for the network installer to successfully boot.
This can done by selecting _Install_ and hitting _\<Tab\>_ within the installation menu.

```terminfo
linux vga=off initrd=initrd.gz --- console=ttyS0,115200u8
```

With the release of Ubuntu 20.04 LTS support for the network installer has been dropped in favor of the standard Ubuntu
Live server image.

> For 20.04 LTS, users can use the new Ubuntu Live installer to setup and configure a network install.

Trying to boot Ubuntu 20.04 with the previous boot parameters doesn't work and results in memory allocation errors.

```terminfo
boot: /casper/vmlinuz vga=off initrd=/casper/initrd --- console=ttyS0,115200u8
Loading /casper/vmlinuz... ok
Loading /casper/initrd...ok
Booting kernel failed: Invalid argument
boot:
Could not allocate memory.
boot:
Could not allocate memory.
boot:
Could not allocate memory.
boot:
...
```

It's still possible to install Ubuntu 20.04 LTS on an APU board by performing a network installation using PXE as
described in [another note](./2020-04-28-pxe-booting-ubuntu-using-dnsmasq.md)

[www.apu-borad.de]: https://www.apu-board.de/
[ubuntu.com:download:alternative]: https://ubuntu.com/download/alternative-downloads
