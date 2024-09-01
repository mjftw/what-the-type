/**
 * This file contains usage examples for the Result type.
 */
import { Result } from "./result";

// Usage examples
function divide(x: number, y: number): Result<number, string> {
  if (y === 0) {
    return Result.err("Cannot divide by zero");
  }
  return Result.ok(x / y);
}

function square(x: number): number {
  return x * x;
}

function sqrt(x: number): Result<number, string> {
  if (x < 0) {
    return Result.err("Cannot square root negative number");
  }
  return Result.ok(Math.sqrt(x));
}

function example() {
  const a = Result.ok(5);
  const b = a.map(square);
  const c = divide(10, 2);
  const d = c.andThen(sqrt);
  const e = divide(10, 0);
  const f = e.mapErr((error) => error + "!!");
  const g = e.unwrapOr(NaN);

  if (a.isOk) {
    console.log("a is ok! ", a.value);
  }

  if (c.isOk) {
    console.log("c is ok! ", c.value);
  }

  if (!f.isOk) {
    console.log("f is err! ", f.error);
  }

  console.log(a, b, c, d, e, f, g);

  // This will throw an error!
  f.unwrap();
}

function chainingExample() {
  const result = Result.ok(5)
    .map(square)
    .andThen((x) => divide(x, 2))
    .mapErr((error) => error + "!!")
    .map((x) => x.toString())
    .unwrapOr("default");

  console.log(result);
}

chainingExample();
