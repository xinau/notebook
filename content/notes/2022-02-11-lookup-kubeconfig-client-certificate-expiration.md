---
title: Lookup Kubeconfig Client Certificate Expiration
date: 2022-02-11T13:22:08Z
tags: ["kubernetes", "kubernetes/kubeconfig", "openssl"]
---

Kubernetes supports [x509 client certificates][kubernetes.io:authentication:x509] for authentication against the
Kubernetes API server. The expiration of a clients certificates inside the kubeconfig can be viewed as follows with
`openssl`.

```
kubectl config view -o jsonpath='{.users[?(@.name == "admin")].user.client-certificate-data}' \
| base64 -d \
| openssl x509 -in - -noout -text
```

[kubernetes.io:authentication:x509]:
  https://kubernetes.io/docs/reference/access-authn-authz/authentication/#x509-client-certs
