---
title: Serde Deserialize Empty String as Option in Rust
date: 2021-08-27T08:59:38Z
draft: true
tags: ["rust", "rust/serde"]
---

```rust

struct Fruit {
    #[serde(deserialize_with="empty_string_as_none")]
    color: String,
}

fn empty_string_as_none<'de, D, String>(de: D) -> Result<Option<String>, D::Error>
    where
        D: serde::Deserializer<'de>,
{
    match String::deserialize(de)?.as_str() {
        "" => Ok(None),
        str => Ok(Some(str))
    }
}
```

```rust
fn empty_string_as_none<'de, D, T>(de: D) -> Result<Option<T>, D::Error>
    where
        D: serde::Deserializer<'de>,
        T: serde::Deserialize<'de>,
{
    match String::deserialize(de)?.as_str() {
        "" => Ok(None),
        str => T::deserialize(str.into_deserializer()).map(Some),
    }
}
```

[1]: https://github.com/serde-rs/serde/issues/1425#issuecomment-462282398
