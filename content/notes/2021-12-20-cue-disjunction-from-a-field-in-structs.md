---
title: CUE Disjunction From a Field in Structs
date: 2021-12-30T19:54:16Z
tags: ["cue", "cue/comprehension", "cue/disjunction"]
---

Often configurations contain a references to other configuration values based on an identifier field, E.x. in
Alertmanager users can define a list of _receivers_ and reference them by their _name_ inside a _route's receiver_. A
valid Alertmanager configuration requires that the value of a _route's receiver_ needs to be a _name_ of a _receiver_
inside the list of _receivers_.

In CUE a _route's receiver_ would be represented by a disjunction containing all _receiver names_. Such a schema can be
defined in CUE using [comprehensions][cuelang.org:docs:spec:comprehensions] and the builtin [or
function][cuelang.org:docs:spec:or], I.e.

```cue
receivers: [...{
  name: string
}]

route: receiver: or([ for r in receivers {r.name}])
```

[cuelang.org:docs:spec:comprehensions]: https://cuelang.org/docs/references/spec/#comprehensions
[cuelang.org:docs:spec:or]: https://cuelang.org/docs/references/spec/#or
