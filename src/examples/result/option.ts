/**
 * The Option type is used to represent the result of an operation that may or may not return a value.
 * It is often used for situations where a function may not return a value, and doing so is not an error.
 *
 * For example, if we were attempting to fetch a user record from a database by ID, there might not be
 * a record for that ID, so we return an Option<User>.
 * If there was a record, we would return it wrapped in `Some<User>`, and if there was no record, we would return `None`.
 *
 * It can be used as a more type-safe alternative to returning `null` or `undefined`.
 *
 * This is distinct from a `Result<T, E>`, where `E` is an error type, meaning that the operation could fail.
 * In other words, an `Err` is a failure, whereas an `Option` can contain no value and that's okay.
 */

import { Result } from "./result";

const someTag = Symbol("Some");
const noneTag = Symbol("None");

interface Some<T> {
  _tag: typeof someTag;
  isSome: true;
  value: T;
  unwrap(): T;
  unwrapOr<T2>(defaultValue: T2): T;
  map<T2>(fn: (value: T) => T2): Option<T2>;
  andThen<T2>(fn: (value: T) => Option<T2>): Option<T2>;
  toResult<E>(error: E): Result<T, never>;
}

interface None {
  _tag: typeof noneTag;
  isSome: false;
  unwrap(): never;
  unwrapOr<T2>(defaultValue: T2): T2;
  map<T2>(fn: (value: never) => T2): Option<T2>;
  andThen<T2>(fn: (value: never) => Option<T2>): Option<T2>;
  toResult<E>(error: E): Result<never, E>;
}

type Option<T> = Some<T> | None;

namespace Option {
  export function some<T>(value: T): Some<T> {
    return {
      _tag: someTag,
      isSome: true,
      value,
      unwrap() {
        return value;
      },
      unwrapOr<T2>(_defaultValue: T2): T {
        return value;
      },
      map<T2>(fn: (value: T) => T2): Option<T2> {
        return Option.some(fn(value));
      },
      andThen<T2>(fn: (value: T) => Option<T2>): Option<T2> {
        return fn(value);
      },
      toResult<E>(_error: E): Result<T, never> {
        return Result.ok(value);
      },
    };
  }

  export const none: None = {
    _tag: noneTag,
    isSome: false,
    unwrap() {
      throw new Error("Cannot unwrap None");
    },
    unwrapOr<T2>(defaultValue: T2): T2 {
      return defaultValue;
    },
    map<T2>(_fn: (value: never) => T2): Option<T2> {
      return this;
    },
    andThen<T2>(_fn: (value: never) => Option<T2>): Option<T2> {
      return this;
    },
    toResult<E>(error: E): Result<never, E> {
      return Result.err(error);
    },
  };

  export function isSome<T>(option: Option<T>): option is Some<T> {
    return option._tag === someTag;
  }

  export function isNone<T>(option: Option<T>): option is None {
    return option._tag === noneTag;
  }

  export function assertSome<T>(option: Option<T>): asserts option is Some<T> {
    if (option._tag !== someTag) {
      throw new TypeError("Expected a Some, but got a None");
    }
  }

  export function assertNone<T>(option: Option<T>): asserts option is None {
    if (option._tag !== noneTag) {
      throw new TypeError("Expected a None, but got a Some");
    }
  }
}

export { Option, Some, None };
