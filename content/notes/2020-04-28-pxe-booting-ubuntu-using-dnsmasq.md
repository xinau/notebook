---
title: PXE Booting Ubuntu Using Dnsmasq
date: 2020-04-28T15:16:48Z
tags: ["dnsmasq", "pxe", "ubuntu"]
---

With the release of Ubuntu 20.04 LTS support for the [network installer][ubuntu.com:download:alternative] has been
dropped in favor of the standard Ubuntu Live server image.

> For 20.04 LTS, users can use the new Ubuntu Live installer to setup and configure a network install.

The alternative downloads pages points to a [discourse thread][discourse.ubuntu.com:netbooting] for setting up a network
installation using a [Preboot eXecution Environment][en.wikipedia.org:pxe] (PXE). PXE is a specification for a
client-server architecture which allows any client to boot a software assembly using only a PXE-capable network
interface controller. PXE relies on DHCP and TFTP for providing the boot environment.

Such an environment can be created with [Dnsmasq's][www.thekelleys.org.uk:dnsmasq:doc] DHCP subsystem. The following
steps need to be performed for booting Ubuntu 20.04 LTS on a host using PXE.

The first step is to install Dnsmasq and configure a static ip address on the Dnsmasq host. This setup uses a NIC in a
separate network containing only the APU board. Dnsmasq is set up to only listen on this NIC to avoid collision with
DHCP servers in other networks available through other NICs.

```bash
sudo apt-get install dnsmasq
sudo ip addr add dev enp0s1 192.168.0.1/24
```

The Dnsmasq configuration file located at _/etc/dnsmasq.d/pxe.conf_ is used to configure DHCP and TFTP to perform a PXE
boot server.

```
interface=enp0s1,lo
bind-interfaces
dhcp-range=192.168.0.100,192.168.0.200
dhcp-boot=pxelinux.0
enable-tftp
tftp-root=/srv/tftp
```

In the next step a boot environment is setup inside the TFTP root directory using an official Ubuntu Live server image.

```bash
mkdir -p /srv/tftp /srv/tftp/pxelinux.cfg
wget http://archive.ubuntu.com/ubuntu/dists/eoan/main/installer-amd64/current/images/netboot/ubuntu-installer/amd64/pxelinux.0
sudo cp pxelinux.0 /srv/tftp

wget http://cdimage.ubuntu.com/ubuntu-server/daily-live/current/focal-live-server-amd64.iso
sudo mount focal-live-server-amd64.iso /mnt
sudo cp /mnt/casper/initrd /srv/tftp
sudo cp /mnt/casper/vmlinuz /srv/tftp
sudo cp -r /mnt/isolinux /srv/tftp
umount focal-live-server-amd64.iso
```

The PXE configuration file located at _/srv/tftp/pxelinux.cfg/default_ should contain the following content which
specifies the location of the image as well as serial console parameters.

```
DEFAULT install
LABEL install
    KERNEL vmlinuz
    INITRD initrd
    APPEND ip=dhcp url=http://192.168.0.1:8080/focal-live-server-amd64.iso vga=off console=ttyS0,115200u8
```

The last steps serves the previously downloaded Ubuntu Live server image with NGINX, since internet access hasn't been
configured on the client.

```bash
mkdir -p ubuntu
cp focal-live-server-amd64.iso ubuntu
docker run -v $(pwd)/ubuntu:/usr/share/nginx/html:ro --rm -p 8080:80 -it nginx
```

[ubuntu.com:download:alternative]: https://ubuntu.com/download/alternative-downloads
[discourse.ubuntu.com:netbooting]: https://discourse.ubuntu.com/t/netbooting-the-live-server-installer/14510
[en.wikipedia.org:pxe]: https://en.wikipedia.org/wiki/Preboot_Execution_Environment
[www.thekelleys.org.uk:dnsmasq:doc]: http://www.thekelleys.org.uk/dnsmasq/doc.html
