---
title: Git Sign-Off Commits Using Prepare-Commit-Msg Hook
date: 2022-01-12T11:05:03Z
tags: ["git", "git/hook"]
---

It’s possible to automate the sign-off of git commits using the [git hook][git-scm.com:git-hooks] `prepare-commit-msg`.
The hook can be created with the following commands. In case a `prepare-commit-msg` hook already exists, it needs to be
adapted accordingly instead.

```bash
cat <<'EOF' > .git/hooks/prepare-commit-msg
#!/bin/sh

if ! command -v git > /dev/null ; then
    echo "error: command git not found"
    exit 1
fi

NAME=$(git config user.name)
EMAIL=$(git config user.email)

if [ -z "$NAME" ]; then
    echo "error: empty git config user.name"
    exit 1
fi

if [ -z "$EMAIL" ]; then
    echo "error: empty git config user.email"
    exit 1
fi

git interpret-trailers --if-exists doNothing --trailer \
    "Signed-off-by: $NAME <$EMAIL>" \
    --in-place "$1"
EOF
chmod +x .git/hooks/prepare-commit-msg
```

The `-s` flag will now be implied every time a commit is created.

[git-scm.com:git-hooks]: https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks
