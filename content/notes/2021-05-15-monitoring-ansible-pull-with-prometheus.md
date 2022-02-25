---
title: Monitoring ansible-pull With Prometheus
date: 2021-05-15T13:10:13Z
tags: ["ansible", "ansible/ansible-pull", "prometheus", "prometheus/node-exporter"]
---

With [ansible-pull][docs.ansible.com:cli:ansible-pull] it's possible to scale Ansible to near-limitless deployments by
inverting Ansible's default push architecture into a pull-based architecture. This is done by having a remote copy of
Ansible on each managed node, each configured to run via a cronjob and update the playbooks source from a source control
repository.

Due to ansible-pull being run headless it's important to configure logging as well as monitoring for the playbook
execution. As they're crucial for investigating playbook failures, detecting changes and configuration drift as well as
audibility.

Even though, Ansible doesn't provide any direct integration for Prometheus, it's possible to report playbook execution
statistics using a custom [callback_plugin][docs.ansible.com:plugins:callback]. The plugin is used for writing metrics
to a local file that's being read and exposed by the node exporters [textfile
collector][github.com:prometheus:node-exporter:textfile-collector].

I've previously written such a plugin which can simply be copied into the `callback_plugins` directory. It's inspired by
the [JUnit callback plugin][github.com:ansible:ansible:junit] and makes use of the Prometheus [client_python
library][github.com:prometheus:client-python]. The plugin is currently provided through this [GitHub
Gist][gist.github.com:xinau:75c8d3].

[docs.ansible.com:cli:ansible-pull]: https://docs.ansible.com/ansible/latest/cli/ansible-pull.html
[docs.ansible.com:plugins:callback]: https://docs.ansible.com/ansible/latest/plugins/callback.html
[github.com:ansible:ansible:junit]: https://github.com/ansible/ansible/blob/devel/lib/ansible/plugins/callback/junit.py
[github.com:prometheus:client-python]: https://github.com/prometheus/client_python
[github.com:prometheus:node-exporter:textfile-collector]: https://github.com/prometheus/node_exporter#textfile-collector
[gist.github.com:xinau:75c8d3]: https://gist.github.com/xinau/75c8d385a1c282b05d53d09f7a2b35b4
