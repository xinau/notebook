---
title: Different Environment Configurations per Terraform Workspace
date: 2020-05-18T16:29:58Z
tags: ["terraform", "terraform/environments", "terraform/workspaces"]
---

Terraform [workspaces][terraform.io:docs:state:workspaces] are useful for storing different configurations per
environment within the same backend. In order to make changes to the configuration based on the current workspace the
workspace name can be referenced in terraform using `terraform.workspace` variable.

The immediate approach to have different settings per environment would be to use the ternary operator on the workspace
name per setting, I.e.

```terraform
resource "aws_instance" "vm-1" {
  ami = (terraform.workspace == "staging"
    ? "ami-0b6d8a6db0c665fb7" # 18.04 LTS
    : "ami-05c26ae4789875080" # 20.04 LTS
  )
  instance_type = (terraform.workspace == "production"
    ? "m5.large"
    : "t3.large"
  )
}
```

This method not only reduces readability with more environments, but also makes it harder to infer the configuration of
a specific environment as well as default values.

In contrast [input variables][terraform.io:docs:configuration:variables] can be used alter the configuration without
changing the source code. The values for these variables can be provided through a custom variable file (`.tfvars`)
using the command line flag `-var-file`, which allows the user to have environment specific settings in a single
location. This means that users aren't only required to switch workspaces but also need to specify a different variable
file for each environment.

An open [feature requests][github.com:hashicorp:terraform:issues:15966] exists that tries to resolve this issue by
automatically loading variables from a variable file based on the current workspace. The comment section of this issue
mentions various workarounds by users. [One workaround][github.com:hashicorp:terraform:issues:15966:comment:381168714]
is the use of a _local_ which contains a nested map where the keys of the outer map match the `terraform.workspace`
name, I.e.

```terraform
locals {
  env = merge(local.vars["defaults"], local.vars[terraform.workspace])
  vars = {
    defaults = {
      instance_type = "t3.large"
    }

    staging = {
      ami = "ami-05c26ae4789875080" # 20.04 LTS
    }

    production = {
      ami           = "ami-0b6d8a6db0c665fb7" # 18.04 LTS
      instance_type = "m5.large"
    }
  }
}

resource "aws_instance" "vm-1" {
  ami           = local.env["ami"]
  instance_type = local.env["instance_type"]
}
```

[Another option][github.com:hashicorp:terraform:issues:15966:comment:927771297] is to use compute the variable filename
based on the output of `terraform workspace show`, I.e.

```bash
terraform plan -var-file "$(terraform workspace show).tfvars"
```

[terraform.io:docs:state:workspaces]: https://www.terraform.io/docs/state/workspaces.html
[terraform.io:docs:configuration:variables]: https://www.terraform.io/docs/configuration/variables.html
[github.com:hashicorp:terraform:issues:15966]: https://github.com/hashicorp/terraform/issues/15966
[github.com:hashicorp:terraform:issues:15966:comment:381168714]:
  https://github.com/hashicorp/terraform/issues/15966#issuecomment-381168714
[github.com:hashicorp:terraform:issues:15966:comment:927771297]:
  https://github.com/hashicorp/terraform/issues/15966#issuecomment-927771297
