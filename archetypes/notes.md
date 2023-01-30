---
title: "{{ replace .Name "-" " " | replaceRE `([0-9]+\s+)+` "" | title }}"
date: "{{ .Date }}"
draft: true 
tags: []
---
