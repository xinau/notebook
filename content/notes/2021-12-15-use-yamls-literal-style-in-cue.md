---
title: Use YAMLs Literal Style in CUE
date: 2021-12-15T12:49:17Z
draft: true
tags: ["cue", "yaml"]
---

```cue
import (
    "encoding/yaml"
    "strings"
)

str: #"""
Sammy Sosa completed another
fine season with great stats.

  63 Home Runs
  0.288 Batting Average

What a year!
"""#

#_indent: in: string
#_indent: out: " " + strings.Join(strings.Split(str, "\n"), "\n ")

out: yaml.Unmarshal(">-\n\({#_indent & {in: str}}.out)")
```

```console
$ cue eval test.cue -e out
"""
    Sammy Sosa completed another fine season with great stats.

      63 Home Runs
      0.288 Batting Average

    What a year!
    """
```

https://yaml.org/spec/1.2-old/spec.html#id2795688
