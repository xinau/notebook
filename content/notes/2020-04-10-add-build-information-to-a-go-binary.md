---
title: Add Build Information to a Go Binary
date: 2020-04-10T12:31:16Z
tags: ["go", "go/linker", "git"]
---

It's good practice to include a build information like version and other metadata in an applications binary, since these
are often useful for troubleshooting, monitoring, and debugging purposes later on. As this information changes with each
new build, maintaining these values in source code isn't a viable option.

This problem is often solved with a link editor. Go's [linker][golang.org:linker] supports setting a string variable
under a given import path e.x. `main.GitRef` using the `-X` flag. This can then be used to supply build information like
a version control reference from which the application is build as the value of a know variable. I.e.

```go
package main

import (
    "fmt"
)

var (
    // GitRef is supplied by the linker.
    GitRef string = "invalid:-use-ld-flags"
)

func main() {
    fmt.Printf("build from git reference %s\n", GitRef)
}
```

```bash
gitref=$(git describe --tags --always --dirty)
go build -ldflags -X main.GitRef=${gitref}
```

[golang.org:linker]: https://golang.org/cmd/link/
