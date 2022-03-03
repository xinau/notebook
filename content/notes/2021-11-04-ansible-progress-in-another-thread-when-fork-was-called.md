---
title: Ansible Progress in Another Thread When fork() Was Called
date: 2021-11-04T14:30:51Z
draft: true
tags: ["ansible", "ansible/aws", "mac/osx"]
---

On Mac OS High Sierra an ansible bug might be visible as a security measures has been added to restricted
multithreading. This can be mitigated by exporting `OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES`.

```console
TASK [debug] ******************************************************************************************************************************************************************************************************
objc[62774]: +[__NSCFConstantString initialize] may have been in progress in another thread when fork() was called.
objc[62775]: +[__NSCFConstantString initialize] may have been in progress in another thread when fork() was called.
objc[62774]: +[__NSCFConstantString initialize] may have been in progress in another thread when fork() was called. We cannot safely call it or ignore it in the fork() child process. Crashing instead. Set a breakpoint on objc_initializeAfterForkError to debug.
objc[62775]: +[__NSCFConstantString initialize] may have been in progress in another thread when fork() was called. We cannot safely call it or ignore it in the fork() child process. Crashing instead. Set a breakpoint on objc_initializeAfterForkError to debug.
ERROR! A worker was found in a dead state
```
