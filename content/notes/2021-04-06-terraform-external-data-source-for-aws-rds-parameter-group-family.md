---
title: Terraform External Data-Source for AWS RDS Parameter Group Family
date: 2021-04-06T03:55:13Z
tags: ["aws", "aws/rds", "terraform", "terraform/external-data-source"]
---

In AWS Database Parameter Groups are used to specify how a database is configured. When managing a Database Parameter
Group with Terraform users of this resource are required to set the Parameter Group Family. This Parameter Group Family
is a string based on the database engine and engine version and can be [queried for with the AWS
CLI][docs.aws.amazon.com:cli:rds:describe-db-engine-versions].

Even though it's possible to query the Parameter Group Family through the AWS CLI, the Terraform AWS Provider doesn't
provide a data-source to do so. To still retrieve this information dynamically based on the database engine and engine
version and not having to "hard-code" the Parameter Group Family an external data-source can be used as follows.

```terraform
data "aws_region" "main" {}

data "external" "main" {
  program = ["${path.module}/get-parameter-group-family.sh"]
  query = {
    engine         = var.engine
    engine_version = var.engine_version
    region         = data.aws_region.main.name
  }
}

resource "aws_db_parameter_group" "main" {
  name   = var.name
  family = data.external.main.result.family
  # ...
}
```

The external data-source determines the Parameter Group Family by making use of the AWS CLI and jq.

```bash
#!/usr/bin/env bash
set -euo pipefail

eval "$(jq -r '@sh "engine=\(.engine) engine_version=\(.engine_version) region=\(.region)"')"
family=$(aws rds describe-db-engine-versions \
  --engine "${engine}" \
  --engine-version "${engine_version}" \
  --output text \
  --region "${region}" \
  --query "DBEngineVersions[0].DBParameterGroupFamily")
jq -n --arg family "${family}" '{"family":$family}'
```

[docs.aws.amazon.com:cli:rds:describe-db-engine-versions]:
  https://docs.aws.amazon.com/cli/latest/reference/rds/describe-db-engine-versions.html
