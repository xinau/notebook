---
title: Bootstrap a Terraform AWS Backend With Terraform
date: 2020-04-06T16:26:37Z
tags: ["aws", "terraform", "terraform/backend"]
---

Terraform supports various [backends][terraform.io:docs:backends] which are used for remote state storage and locking.
On AWS a S3 bucket and DynamoDB table can be used as a backend. Ideally one want to manage these resources using
terraform as well, which results in a chicken or the egg problem. This situation can be resolved by using terraform's
local backend for bootstrapping and terraform's ability to copy existing state to a new backend.

Using this [GitHub Gist][gist.github.com:xinau:6f0a76] a remote backend on AWS can be created as follows.

1. Initialize a new terraform working directory. Since no remote backend is configured, terraform's local backend is
   used.

   ```bash
   terraform init
   ```

2. Create the resources used by the remote backend. The gist uses the same input variables as used by the backend
   configuration.

   ```bash
   cat << EOF > backend.hcl
   bucket         = "terraform-state"
   dynamodb_table = "terraform-state-lock"
   encrypt        = true
   region         = "eu-central-1"
   EOF
   terraform apply -var-file backend.hcl
   ```

3. Copy the existing local state of the newly created remote backend. This step makes use of [partial
   configuration][terraform.io:docs:backends:partitial-configuration], which requires at minimum an empty backend
   configuration.

   ```bash
   cat << EOF > terraform.tf
   terraform {
     backend "s3" {
       key = "backend.tfstate"
     }
   }
   EOF
   terraform init -backend-config backend.hcl -force-copy -reconfigure
   ```

4. It's good practice to manage other resources with the same remote backend using a different state file. On AWS this
   means choosing a different [backend key][terraform.io:docs:backends:types:s3].

[gist.github.com:xinau:6f0a76]: https://gist.github.com/xinau/6f0a76504063d48d60b3583469ea79ed
[terraform.io:docs:backends]: https://www.terraform.io/docs/backends/index.html
[terraform.io:docs:backends:partitial-configuration]:
  https://www.terraform.io/docs/backends/config.html#partial-configuration
[terraform.io:docs:backends:types:s3]: https://www.terraform.io/docs/backends/types/s3.html#key
