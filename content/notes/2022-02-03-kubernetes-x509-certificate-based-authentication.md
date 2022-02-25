---
title: Kubernetes X509 Certificate Based Authentication
date: 2022-02-03T15:58:51Z
tags: ["kubernetes", "kubernetes/authentication", "kubernetes/kubeconfig"]
---

Kubernetes [assumes][kubernetes.io:authentication:users] that a cluster-independent service manages normal users in the
following ways

- an administrator distributing private keys
- a user store like Keystone or Google Accounts
- a file with a list of usernames and passwords

Users can be managed using [x509 client certificates][kubernetes.io:authentication:x509]. The subject of the certificate
is used to identify a user and groups it belongs to `/CN=alice/O=frontend/O=developer`

```bash
openssl req -newkey rsa:2048 -nodes -keyout alice.key -out alice.csr -subj '/CN=alice/O=frontend/O=developer'
sudo openssl x509 -req -in alice.csr -CA /etc/kubernetes/pki/ca.crt -CAkey /etc/kubernetes/pki/ca.key -CAcreateserial -out alice.crt
```

Check that private key likely matches public key and certificate signing request.

```bash
openssl rsa -noout -modulus -in alice.key | openssl md5
openssl x509 -noout -modulus -in alice.crt | openssl md5
openssl req -noout -modulus -in alice.csr | openssl md5
```

For demonstration purposes a pod-reader role and role binding is created with permissions to list, read and watch pods,
pods/status and pods/logs resources.

```bash
kubectl create role pod-reader --verb=get --verb=list --verb=watch --resource=pods,pods/status,pods/logs
kubectl create rolebinding pod-reader@developer --role pod-reader --group developer
```

A kubeconfig user and context can be generated using the following `kubectl` commands

```bash
kubectl config set users.kubernetes-developer.client-certificate-data "$(base64 -i developer.crt)"
kubectl config set users.kubernetes-developer.client-key-data "$(base64 -i developer.key)"
kubectl config set contexts.kubernetes-developer@kubernetes.cluster kubernetes
kubectl config set contexts.kubernetes-developer@kubernetes.user kubernetes-developer
```

[kubernetes.io:authentication:users]:
  https://kubernetes.io/docs/reference/access-authn-authz/authentication/#users-in-kubernetes
[kubernetes.io:authentication:x509]:
  https://kubernetes.io/docs/reference/access-authn-authz/authentication/#x509-client-certs
