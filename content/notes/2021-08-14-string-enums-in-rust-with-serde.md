---
title: String Enums in Rust With Serde
date: 2021-08-14T10:09:17Z
tags: ["rust", "rust/serde"]
---

**Disclaimer** I've started learning Rust, therefore the following needs to be taken with appropriate amount of salt.

When (de)serializing from and to an API it can happen, that a string field can only return a fixed number of
possibilities. Such cases are often best represented in a client library by using an
[Enumeration][doc.rust-lang.org:reference:enumerations], as this forces users of the client to only be able supply a
valid string. This can be represented in Rust as follows.

```rust
use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize)]
enum Fruit {
    Apple,
    Banana,
    Orange,
    Plum,
    Tomato,
}
```

The `#[derive]` attribute instructs the compiler to provide implementations for the `Deserializer` and `Serializer`
traits of the _Fruit_ enumeration, instead of having to implement them manually.

It's possible to leverage the `Deserializer` trait of Serde for implementing the `FromStr` trait without having to
manually write a pattern for each match expression pattern. This can be useful for fields that need to be renamed to
match their serialization.

```rust
use std::str::FromStr;
use serde::de::{value, IntoDeserializer};

impl FromStr for Fruit {
    type Err = value::Error;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Self::deserialize(s.into_deserializer())
    }
}
```

Most parts of this implementation of `FromStr` comes from the documentation of
[IntoDeserializer][docs.serde.rs:de:trait:into-deserializer].

[doc.rust-lang.org:reference:enumerations]: https://doc.rust-lang.org/reference/items/enumerations.html
[docs.serde.rs:de:trait:into-deserializer]: https://docs.serde.rs/serde/de/trait.IntoDeserializer.html#example
