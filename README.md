![WTT](./images/what-the-type-logo-wide.svg)

# What the Type?

This example project is written with the hope of showcasing some of the more interesting parts of
the Typescript type system, and how you can use them for fun and profit.

## The code

### Result & Option types

A Rust style [Result](https://doc.rust-lang.org/std/result/) & [Option](https://doc.rust-lang.org/std/option/) type is a great way to show some interesting types in action, so we've got these.

Check them out at [src/examples/result/result.ts](./src/examples/result/result.ts) and [src/examples/result/option](./src/examples/result/option.ts)

They have 100% test coverage and would be very usable in real production code.

These examples demonstrate the following concepts in action:

- Generic types
- Tagged union types
- Type guards and type assertions

Have a look through the tests to see some examples of using them in practice.
