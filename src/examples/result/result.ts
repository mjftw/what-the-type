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
}

export { Result, Ok, Err };
