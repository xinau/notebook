---
title: Get Content From a .deb from a Repository
date: 2021-09-09T05:23:56Z
draft: true
tags: ["apt", "dpkg"]
---

```bash
tmp_dir=test
mkdir -p $tmp_dir
apt-get download -o dir::cache::archive=$tmp_dir package
dpgk-deb -xv package*.deb $tmp_dir
```
