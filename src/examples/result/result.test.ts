import { describe, it, expect } from "vitest";
import { Result } from "./result";

describe("Result", () => {
  it("should unwrap ok value", () => {
    const result = Result.ok(5);
    expect(result.unwrap()).toBe(5);
  });

  it("should throw when unwrapping err", () => {
    const result = Result.err("error");
    expect(() => result.unwrap()).toThrow("Cannot unwrap Err");
  });

  it("should return ok value with unwrapOr", () => {
    const result = Result.ok(5);
    expect(result.unwrapOr(10)).toBe(5);
  });

  it("should return default value with unwrapOr on err", () => {
    const result = Result.err("error");
    expect(result.unwrapOr(10)).toBe(10);
  });

  it("should map ok value", () => {
    const result = Result.ok(5).map((x) => x * 2);
    expect(result.unwrap()).toBe(10);
  });

  it("should not map err value", () => {
    const result = Result.err("error").map((x) => x * 2);
    expect(result.unwrapOr(10)).toBe(10);
  });

  it("should not change ok value with mapErr", () => {
    const result = Result.ok(5).mapErr((err) => err + "!!");
    expect(result.unwrap()).toBe(5);
  });

  it("should map err value with mapErr", () => {
    const result = Result.err("error").mapErr((err) => err + "!!");
    expect(result.unwrapOr(10)).toBe(10);

    expect(result.isOk).toBe(false);
    !result.isOk && expect(result.error).toBe("error!!");
  });

  it("should chain ok value with andThen", () => {
    const result = Result.ok(5).andThen((x) => Result.ok(x * 2));
    expect(result.unwrap()).toBe(10);
  });

  it("should not chain err value with andThen", () => {
    const result = Result.err("error").andThen((x) => Result.ok(x * 2));
    expect(result.unwrapOr(10)).toBe(10);
  });

  it("should handle chaining example correctly", () => {
    const result = Result.ok(5)
      .map((x) => x * 2)
      .andThen((x) => Result.ok(x / 2))
      .mapErr((err) => err + "!!")
      .map((x) => x.toString())
      .unwrapOr("default");

    expect(result).toBe("5");
  });

  it("should unwrap ok value with string", () => {
    const result = Result.ok("success");
    expect(result.unwrap()).toBe("success");
  });

  it("should unwrap ok value with object", () => {
    const result = Result.ok({ key: "value" });
    expect(result.unwrap()).toEqual({ key: "value" });
  });

  it("should throw when unwrapping err with different message", () => {
    const result = Result.err("different error");
    expect(() => result.unwrap()).toThrow("Cannot unwrap Err");
  });

  it("should chain ok value with andThen returning err", () => {
    const result = Result.ok(5).andThen(() => Result.err("chained error"));
    expect(result.unwrapOr("default")).toBe("default");
  });

  it("should map ok value with complex function", () => {
    const result = Result.ok(5).map((x) => x * x + 2);
    expect(result.unwrap()).toBe(27);
  });

  it("should map err value with complex function", () => {
    const result = Result.err("error").mapErr(
      (err) => err.toUpperCase() + "!!"
    );
    expect(result.unwrapOr("default")).toBe("default");
    expect(result.isOk).toBe(false);
    !result.isOk && expect(result.error).toBe("ERROR!!");
  });

  it("should handle chaining with multiple andThen and map", () => {
    const result = Result.ok(5)
      .andThen((x) => Result.ok(x * 2))
      .andThen((x) => Result.ok(x + 3))
      .map((x) => x.toString())
      .unwrapOr("default");

    expect(result).toBe("13");
  });

  it("should handle chaining with andThen returning err in the middle", () => {
    const result = Result.ok(5)
      .andThen((x) => Result.ok(x * 2))
      .map((x) => x.toString())
      .andThen((x) => Result.err("mid error"))
      .map((x) => String(x))
      .unwrapOr("default");

    expect(result).toBe("default");
  });

  // Example function that returns a Result, for use in the following tests
  function sqrt(x: number): Result<number, string> {
    if (x < 0) {
      return Result.err("Cannot calculate square root of negative number");
    }
    return Result.ok(Math.sqrt(x));
  }

  describe("isOk", () => {
    it("should return true for ok value", () => {
      const result = sqrt(4);
      const itIsOk = Result.isOk(result);
      expect(itIsOk).toBe(true);

      if (itIsOk) {
        // Check the type was narrowed correctly, and that we can access the value
        result.value;
      } else {
        // Check the type was narrowed correctly, and that we can access the error
        result.error;
      }
    });

    it("should return false for err value", () => {
      const result = sqrt(-1);
      const itIsOk = Result.isOk(result);
      expect(itIsOk).toBe(false);

      if (!itIsOk) {
        // Check the type was narrowed correctly, and that we can access the error
        result.error;
      } else {
        // Check the type was narrowed correctly, and that we can access the value
        result.value;
      }
    });
  });

  describe("isErr", () => {
    it("should return false for ok value", () => {
      const result = sqrt(5);
      const itIsAnErr = Result.isErr(result);
      expect(itIsAnErr).toBe(false);

      if (!itIsAnErr) {
        // Check the type was narrowed correctly, and that we can access the value
        result.value;
      } else {
        // Check the type was narrowed correctly, and that we can access the error
        result.error;
      }
    });

    it("should return true for err value", () => {
      const result = sqrt(-1);
      const itIsAnErr = Result.isErr(result);
      expect(itIsAnErr).toBe(true);

      if (!itIsAnErr) {
        // Check the type was narrowed correctly, and that we can access the value
        result.value;
      } else {
        // Check the type was narrowed correctly, and that we can access the error
        result.error;
      }
    });
  });

  describe("assertOk", () => {
    it("should throw when asserting err", () => {
      const result = sqrt(-1);
      expect(() => {
        Result.assertOk(result);

        // Access result.value to prove to the compiler that we've narrowed the type
        // If we got to this point, we have proven to the type checker that `result` was an `Ok`.
        result.value;
      }).toThrow("Expected an Ok, but got an Err");
    });

    it("should return ok value with unwrap", () => {
      const result = sqrt(5);
      Result.assertOk(result);

      // Access result.value to prove to the compiler that we've narrowed the type to an `Ok`
      result.value;
    });
  });

  describe("assertErr", () => {
    it("should throw when asserting ok", () => {
      const result = sqrt(5);
      expect(() => {
        Result.assertErr(result);

        // Access result.error to prove to the compiler that we've narrowed the type to an `Err`.
        // If we got to this point, we have proven to the type checker that `result` was an `Err`.
        result.error;
      }).toThrow("Expected an Err, but got an Ok");
    });

    it("should return err value with unwrap", () => {
      const result = sqrt(-1);
      Result.assertErr(result);

      // Access result.error to prove to the compiler that we've narrowed the type to an `Err`
      result.error;
    });
  });

  it("should map both ok and err values with mapBoth", () => {
    const okResult = Result.ok(5).mapBoth(
      (value) => value * 2,
      (error) => error + "!!"
    );
    expect(okResult.unwrap()).toBe(10);

    const errResult = Result.err("error").mapBoth(
      (value) => value * 2,
      (error) => error + "!!"
    );
    expect(errResult.unwrapOr("default")).toBe("default");
    expect(errResult.isOk).toBe(false);
    !errResult.isOk && expect(errResult.error).toBe("error!!");
  });

  it("should map ok value and ignore err function with mapBoth", () => {
    const result = Result.ok(5).mapBoth(
      (value) => value * 2,
      (error) => error + "!!"
    );
    expect(result.unwrap()).toBe(10);
  });

  it("should map err value and ignore ok function with mapBoth", () => {
    const result = Result.err("error").mapBoth(
      (value) => value * 2,
      (error) => error + "!!"
    );
    expect(result.unwrapOr("default")).toBe("default");
    expect(result.isOk).toBe(false);
    !result.isOk && expect(result.error).toBe("error!!");
  });
});
