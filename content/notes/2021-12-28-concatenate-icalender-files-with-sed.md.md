---
title: Concatenate iCalender Files With Sed
date: 2021-12-28
draft: true
tags: ["ics", "sed"]
---

```bash
cat *.ics | sed '/^END:VCALENDAR/{N;/BEGIN:VCALENDAR/d}' > concated.ics
```
