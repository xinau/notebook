---
title: CUE Command Line Override Filetype Inference
date: 2022-01-13T22:16:19Z
tags: ["cue", "cue/cmd"]
---

The CUE Command Line [automatically infers a files format][github.com:cue-lang:cue:cmd:help:filetypes] based on its
extension. In cases where a different file extension is used like templates, the correct format can be hinted using
qualifiers as follows.

> The cue tool will infer a file's type from its extension by default. The user my override this behavior by using
> qualifiers. A qualifier takes the form
>
>     <tag>{'+'<tag>}':'

```console
$ cue vet test.cue test.yml.hbs
unknown file extension .hbs
$ cue vet test.cue yaml: test.yml.hbs
```

[github.com:cue-lang:cue:cmd:help:filetypes]:
  https://github.com/cue-lang/cue/blob/6bc922c848660781778819a90a343285d0906e2e/cmd/cue/cmd/help.go#L201-L205
