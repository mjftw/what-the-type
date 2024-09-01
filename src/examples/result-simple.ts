/**
 * A simple example of a Result type.
 * It wouldn't be as useful in practice as the `Result` type in `result.ts`, but it's much easier to read.
 *
 * This example showcases use of generics, union types, and type narrowing.
 */

namespace SimpleResult {
  type Ok<T> = {
    isOk: true;
    value: T;
  };

  type Err<E> = {
    isOk: false;
    error: E;
  };

  /**
   * The Result type is a union of the Ok and Err types.
   *
   * Because both types have the isOk key, we can use it to discriminate between the two.
   * If isOk is true, then we know we're working with an Ok, and if it's false, we have an Err.
   * This is an example of a tagged union type.
   */
  type Result<T, E> = Ok<T> | Err<E>;

  // Example usage
  function divide(a: number, b: number): Result<number, string> {
    if (b === 0) {
      return {
        isOk: false,
        error: "Cannot divide by zero",
      };
    }
    return {
      isOk: true,
      value: a / b,
    };
  }

  function example() {
    const result = divide(10, 2);
    if (result.isOk) {
      // Notice how due to the union type, when we know isOk is true,
      // we can access the value directly without checking.
      // This is an example of type narrowing.
      console.log(`It was ok! ${result.value}`);
    } else {
      // When isOk is false, we know the error, and we cannot access the value key.
      // Another example of type narrowing.
      console.error(`It was an error! ${result.error}`);
    }
  }
}
