---
title: HashiCorp Vault as AWS Credential Provider for Terraform
date: 2021-04-06T03:52:05Z
draft: true
tags: ["aws", "terraform", "vault"]
---

HashiCorp Vault has a secret backend for generating aws access credentials. These can also be used in Terraform for use
in the AWS provider.

```terraform
terraform {
  backend "s3" {
    key            = "application.tfstate"
    encrypt        = true
    bucket         = "terraform-state"
    dynamodb_table = "terraform-state-lock"

# INFO: variables in the terraform block are currently not supported.
# see https://github.com/hashicorp/terraform/issues/13022
#     access_key     = data.vault_aws_access_credentials.main.access_key
#     secret_key     = data.vault_aws_access_credentials.main.secret_key
#     token          = data.vault_aws_access_credentials.main.security_token
  }
}

provider "vault" {
  address = "https://vault.example.com"
}

data "vault_aws_access_credentials" "main" {
  backend = "aws"
  role    = "admin"
  type    = "sts"
}

provider "aws" {
  access_key = data.vault_aws_access_credentials.main.access_key
  secret_key = data.vault_aws_access_credentials.main.secret_key
  token      = data.vault_aws_access_credentials.main.security_token
}
```
