---
title: Convert Multiple HEIC Files to JPEG
date: 2022-01-12
draft: true
tags: ["find", "heic"]
---

```bash
sudo apt-get install heif-examples
find -iname "*.HEIC" -exec sh -c 'for f do heif-convert -q 100 $f "$(basename -- "$f" .HEIC).jpg";done' sh {} +
```
