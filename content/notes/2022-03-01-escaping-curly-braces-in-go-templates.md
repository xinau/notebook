---
title: Escaping Curly Braces in Go Templates
date: 2022-03-01T12:20:11Z
tags: ["go", "go/template"]
---

Sometimes applications like Alertmanager have configuration values where users are able to use [Go Templates][pkg.go.dev:text:template] as input to generate user defined output. When templating these configuration files with tools like Flux CD or Helm using Go Templates problems can arise due to configuration values being evaluated by the wrong tool. This problem is often solved using escape sequences, E.x. `\"val\"` instead of `"val"` or `${val}` instead of `%{val}`. Go Templates don't have a escape sequence defined instead this is solved by evaluating a string or string literal containing the opening template sequence or complete template string, I.e.

```go-text-template
{{ "{{" }} .Text }}
{{ `{{ .Text }}` }}
```

The above Go Template would be evaluated to.

```go-text-template
{{ .Text }}
{{ .Text }}
```

[pkg.go.dev:text:template]: https://pkg.go.dev/text/template
