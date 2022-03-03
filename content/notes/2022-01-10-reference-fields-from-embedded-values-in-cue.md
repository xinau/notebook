---
title: Reference Fields From Embedded Values in CUE
date: 2022-01-10
tags: ["cue", "cue/alias"]
---

CUE doesn't define a direct method for referencing fields defined by an embedded value. The reason is that the
identifier of the field being referenced isn't inside defined in the current scope and embedding doesn't alter the
scope.

An embedded field can still be refereed to by either defining the referenced field inside the current scope or using a
[value alias][cuelang.org:docs:spec:aliases] of the current scope, I.e.

```cue
embedded: name: "World"

example: 1: {
	embedded
	name: _
	out: "Hello, \(name)!"
}

example: 2: s = {
	embedded
	out: "Hello, \(s.name)!"
}
```

An [issue][github.com:cue-lang:cue:issue:564] has been raised on GitHub for this behavior and it has been
[suggested][github.com:cue-lang:cue:issue:564:comment] to add `.` to mean _current scope_.

[cuelang.org:docs:spec:aliases]: https://cuelang.org/docs/references/spec/#aliases
[github.com:cue-lang:cue:issue:564]: https://github.com/cue-lang/cue/issues/564
[github.com:cue-lang:cue:issue:564:comment]: https://github.com/cue-lang/cue/issues/564#issuecomment-873388085
