---
title: Terraform Loop Over Attributes Known After Apply
date: 2021-12-30T16:37:28Z
draft: true
tags: ["terraform"]
---

```console
╷
│ Error: Invalid for_each argument
│
│   on main.tf line 31, in resource "aws_lb_target_group_attachment" "main":
│   31:   for_each = toset(var.target_ids)
│     ├────────────────
│     │ var.target_ids is list of string with 2 elements
│
│ The "for_each" value depends on resource attributes that cannot be determined until apply, so Terraform cannot predict how many instances will be created. To work around this, use the -target argument to
│ first apply only the resources that the for_each depends on.
│
```

```diff
 resource "aws_lb_target_group_attachment" "main" {
-  for_each = toset(var.target_ids)  
+  count = length(var.target_ids)

   target_group_arn = aws_lb_target_group.main.arn
-  target_id        = each.key
+  target_id        = var.target_ids[count.index]
   port             = var.port
 }
```
