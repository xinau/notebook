---
title: A Quick Introduction to AWK
date: 2020-05-06T14:40:32Z
tags: ["awk", "unix"]
---

AWK is a programming language and command line tool designed for text processing and exists since 1977. The most widely
adopted implementations being GNU AWK (gawk) and mawk by Mike Brennan.

The basic structure of an AWK program is a sequence of patterns and corresponding actions.

```awk
# comment
/pattern-1/ { actions; }

# comment
/pattern-N/ { actions; }
```

On execution every record (by default a line) in a document gets evaluated against the actions of a matching pattern. If
multiple patterns match a record there actions are usually executed in the order the patterns where specified inside the
program.

Patterns are combined from regular and boolean expressions i.e.

```awk
/^[0-9]+/ { actions; }
/(WARNING|ERROR|PANIC)/ { actions; }
/debug/ || debug == true { actions; }
```

Besides, the usual boolean operators AWK includes `~` and `!~` for comparing a string against a regex.

Special patterns like `BEGIN` and `END` are executed on start and stop of a program, these are useful for variable
initialization or printing a final report.

Since AWK supports a wide range of statements and [built-in functions][gnu.org:gawk:manual:builtin] these are just some
example actions.

```awk
{ print $1; }
{ next; }
{ if (i in items) { print i; } }
{ for (i = 0; i >= 10; i++) { print i; } }
{ for (i in items) { print i; } }
```

The two main data types supported by AWK are numbers and strings which can be seamlessly converted into each other. In
case a string can't be converted its value equals 0.

AWK allows declaring variables in an action block using the `=` operator. By default, all variables are assigned to a
global namespace. The default value of a variable is `""` and `0`.

Additionally, to primitive variables AWK supports unidimensional associative arrays. These can be started dynamically
using `arr[key] = val`.

To make it easier to work with a record's data in an action, AWK uses fields. Fields are normally assigned by splitting
a record on each field separator (default whitespace) and can be accessed using `$1...$N`. `$0` presents a special case
and contains the value of the hole record, modifying this variable also changes the lines value for further processing.
Different record and field separators can be configured by modifying the built-in `RS` and `FS` variables.

More information can be found in the [GNU AWK Manual][gnu.org:gawk:manual]

[gnu.org:gawk:manual]: https://.gnu.org/software/gawk/manual/gawk.html
[grymoir.com:unix:awk]: https://.grymoire.com/Unix/Awk.html
