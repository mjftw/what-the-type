![WTT](./images/what-the-type-logo-wide.svg)

# What the Type?

This example project is written with the hope of showcasing some of the more interesting parts of
the Typescript type system, and how you can use them for fun and profit.

## The code

### Result & Option types

A Rust style [Result](https://doc.rust-lang.org/std/result/) & [Option](https://doc.rust-lang.org/std/option/) type is a great way to show some interesting types in action, so we've got these.

Check them out in [result.ts](./src/examples/result/result.ts) and [option.ts](./src/examples/result/option.ts)

They have 100% test coverage, developer friendly semantics, and and would be very usable in real production code.

These examples demonstrate the following concepts in action:

- Generic types
- Tagged union types
- Type guards and type assertions

#### Example usage

```ts
// First let's define some functions to use in our examples
const divide = (x: number, y: number): Result<number, string> =>
  y === 0 ? Result.err("Cannot divide by zero") : Result.ok(x / y);

const square = (x: number): number => x * x;

const sqrt = (x: number): Result<number, string> =>
  x < 0
    ? Result.err("Cannot square root negative number")
    : Result.ok(Math.sqrt(x));

const example = () => {
  const a = Result.ok(5); // Ok(5)
  const b = a.map(square); // Ok(25)
  const c = divide(10, 2); // Ok(5)
  const d = c.andThen(sqrt); // Ok(2.236)
  const e = divide(10, 0); // Err("Cannot divide by zero")
  const f = e.mapErr((error) => error + "!!"); // Err("Cannot divide by zero!!")
  const g = e.unwrapOr(NaN); // NaN

  // Log out the results
  console.log(a, b, c, d, e, f, g);

  // This will throw an error, since f is an Err
  f.unwrap();
};

const chainingExample = () => {
  const result = Result.ok(5) // Ok(5)
    .map(square) // Ok(25)
    .andThen((x) => divide(x, 2)) // Ok(12.5)
    .mapErr((error) => error + "!!") // Ok(12.5)
    .map((x) => x.toString()) // Ok("12.5")
    .unwrapOr("default"); // "12.5"

  console.log(result);
};
```

Using the `Option` type looks very similar - check out [the tests](./src/examples/result/option.test.ts) to see some working examples.
