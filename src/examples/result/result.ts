/** The Result type is used to represent the result of an operation that could fail.
 *  If is often used for situations where it is not unexpected that things might not work out.
 *
 *  For example, say we are trying to make an API call to a REST API.
 *  We might get a 200 response with a JSON body, or a 404 response with an error body.
 *  We can use a Result to represent the outcome of the API call.
 *  If the API call was successful, we could return Ok(response.body), and if it failed, we could return Err("Oh no!").
 *
 *  The Result type can be used as a type-safe alternative in situations where we might otherwise throw an error.
 */

import { None, Option, Some } from "./option";

/** A Symbol is a unique and immutable data type that is a primitive value.
 * A symbol's only possible value itself.
 */
// Here we define two symbols, okTag and errTag - these are used to identify the type of the Result.
const okTag = Symbol("Ok");
const errTag = Symbol("Err");

/** The Ok type represents a successful computation, and encapsulates a value of the generic type T. */
interface Ok<T> {
  _tag: typeof okTag;
  isOk: true;
  value: T;
  unwrap(): T;
  unwrapOr<T2>(defaultValue: T2): T;
  map<T2>(fn: (value: T) => T2): Result<T2, never>;
  mapErr<E2>(fn: (error: never) => E2): Result<T, E2>;
  andThen<T2, E2>(fn: (value: T) => Result<T2, E2>): Result<T2, E2>;
  mapBoth<T2, E2>(
    okFn: (value: T) => T2,
    errFn: (error: never) => E2
  ): Result<T2, never>;
  toOption(): Some<T>;
}

/** The Err type represents a computation that has failed, and encapsulates an error of the generic type E. */
interface Err<E> {
  _tag: typeof errTag;
  isOk: false;
  error: E;
  unwrap(): never;
  unwrapOr<T2>(defaultValue: T2): T2;
  map<T2>(fn: (value: never) => T2): Result<never, E>;
  mapErr<E2>(fn: (error: E) => E2): Result<never, E2>;
  andThen<T2 = never, E2 = never>(
    fn: (value: never) => Result<T2, E2>
  ): Result<never, E>;
  mapBoth<T2, E2>(
    okFn: (value: never) => T2,
    errFn: (error: E) => E2
  ): Result<never, E2>;
  toOption(): None;
}

/** The Result type is a tagged union of the Ok and Err types.
 *
 * A Result could be either an Ok or an Err, and represents the outcome of a computation.
 */
type Result<T, E> = Ok<T> | Err<E>;

namespace Result {
  export function ok<T>(value: T): Ok<T> {
    return {
      _tag: okTag,
      isOk: true,
      value,
      unwrap() {
        return value;
      },
      unwrapOr<T2>(_defaultValue: T2): T {
        return value;
      },
      map<T2>(fn: (value: T) => T2): Result<T2, never> {
        return Result.ok(fn(value));
      },
      mapErr<E2>(_fn: (error: never) => E2): Result<T, E2> {
        return this as unknown as Result<T, E2>;
      },
      andThen<T2, E2>(fn: (value: T) => Result<T2, E2>): Result<T2, E2> {
        return fn(value);
      },
      mapBoth<T2, E2>(
        okFn: (value: T) => T2,
        _errFn: (error: never) => E2
      ): Result<T2, never> {
        return Result.ok(okFn(value));
      },
      toOption(): Some<T> {
        return Option.some(value);
      },
    };
  }

  export function err<E>(error: E): Err<E> {
    return {
      _tag: errTag,
      isOk: false,
      error,
      unwrap() {
        throw new Error("Cannot unwrap Err");
      },
      unwrapOr<T2>(defaultValue: T2): T2 {
        return defaultValue;
      },
      map<T2>(_fn: (value: never) => T2): Result<never, E> {
        return this;
      },
      mapErr<E2>(fn: (error: E) => E2): Result<never, E2> {
        return Result.err(fn(error));
      },
      andThen<T2, E2>(_fn: (value: never) => Result<T2, E2>): Result<never, E> {
        return this;
      },
      mapBoth<T2, E2>(
        _okFn: (value: never) => T2,
        errFn: (error: E) => E2
      ): Result<never, E2> {
        return Result.err(errFn(error));
      },
      toOption(): None {
        return Option.none;
      },
    };
  }

  /** The `isOk` function is a type guard that checks if a `Result` is an `Ok`.
   * It returns true if the `Result` is an Ok, and false otherwise.
   * This is a type safe way to check the type of a Result, proving to the type checker that the Result is an Ok,
   * rather than just telling it (E.g. using an assertion like `myResult as Ok<T>`).
   */
  export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
    return result._tag === okTag;
  }

  /** The `isErr` function is a type guard that checks if a `Result` is an `Err`.
   * It returns true if the `Result` is an `Err`, and false otherwise.
   * This is a type safe way to check the type of a `Result`, proving to the type checker that the `Result` is an `Err`,
   * rather than just telling it (E.g. using an assertion like `myResult as Err<E>`).
   */
  export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
    return result._tag === errTag;
  }

  /** The `assertOk` function is a type guard that `asserts` that a value is an `Ok`  .
   * This allows the type checker to narrow the type from `Result<T, E>` to `Ok<T>`,
   * allowing access to the `value` property in all subsequent code.
   *
   * This differs from `isOk` in that if the `Result` is not an `Ok`, an error is thrown.
   * This allows all code written after the `assertOk` function call to trust that the `Result` is an `Ok`
   * and access the `value` property without any type assertions.
   *
   * E.g.
   * ```ts
   * function example(result: Result<number, string>) {
   *   Result.assertOk(result);
   *   // We have now narrowed the type of `result` to `Ok<number>`, so we can access the `value` property without any type assertions.
   *   // Without the type assertion, attempting to access `result.value` would be an error.
   *   console.log(result.value);
   * }
   * ```
   */
  export function assertOk<T, E>(
    result: Result<T, E>
  ): asserts result is Ok<T> {
    if (result._tag !== okTag) {
      throw new TypeError("Expected an Ok, but got an Err");
    }
  }

  /** The opposite of `assertOk`, `assertErr` is a type guard that `asserts` that a value is an `Err`. */
  export function assertErr<T, E>(
    result: Result<T, E>
  ): asserts result is Err<E> {
    if (result._tag !== errTag) {
      throw new TypeError("Expected an Err, but got an Ok");
    }
  }
}

export { Result, Ok, Err };
