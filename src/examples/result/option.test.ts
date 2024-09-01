import { describe, it, expect } from "vitest";
import { Option } from "./option";

describe("Option", () => {
  it("should unwrap some value", () => {
    const option = Option.some(5);
    expect(option.unwrap()).toBe(5);
  });

  it("should throw when unwrapping none", () => {
    const option = Option.none;
    expect(() => option.unwrap()).toThrow("Cannot unwrap None");
  });

  it("should return some value with unwrapOr", () => {
    const option = Option.some(5);
    expect(option.unwrapOr(10)).toBe(5);
  });

  it("should return default value with unwrapOr on none", () => {
    const option = Option.none;
    expect(option.unwrapOr(10)).toBe(10);
  });

  it("should map some value", () => {
    const option = Option.some(5).map((x) => x * 2);
    expect(option.unwrap()).toBe(10);
  });

  it("should not map none value", () => {
    const option = Option.none.map((x) => x * 2);
    expect(option.unwrapOr(10)).toBe(10);
  });

  it("should chain some value with andThen", () => {
    const option = Option.some(5).andThen((x) => Option.some(x * 2));
    expect(option.unwrap()).toBe(10);
  });

  it("should not chain none value with andThen", () => {
    const option = Option.none.andThen((x) => Option.some(x * 2));
    expect(option.unwrapOr(10)).toBe(10);
  });

  it("should handle chaining example correctly", () => {
    const option = Option.some(5)
      .map((x) => x * 2)
      .andThen((x) => Option.some(x / 2))
      .map((x) => x.toString())
      .unwrapOr("default");

    expect(option).toBe("5");
  });

  it("should unwrap some value with string", () => {
    const option = Option.some("success");
    expect(option.unwrap()).toBe("success");
  });

  it("should unwrap some value with object", () => {
    const option = Option.some({ key: "value" });
    expect(option.unwrap()).toEqual({ key: "value" });
  });

  it("should chain some value with andThen returning none", () => {
    const option = Option.some(5).andThen(() => Option.none);
    expect(option.unwrapOr("default")).toBe("default");
  });

  it("should map some value with complex function", () => {
    const option = Option.some(5).map((x) => x * x + 2);
    expect(option.unwrap()).toBe(27);
  });

  it("should handle chaining with multiple andThen and map", () => {
    const option = Option.some(5)
      .andThen((x) => Option.some(x * 2))
      .andThen((x) => Option.some(x + 3))
      .map((x) => x.toString())
      .unwrapOr("default");

    expect(option).toBe("13");
  });

  it("should handle chaining with andThen returning none in the middle", () => {
    const option = Option.some(5)
      .andThen((x) => Option.some(x * 2))
      .map((x) => x.toString())
      .andThen(() => Option.none)
      .map((x) => String(x))
      .unwrapOr("default");

    expect(option).toBe("default");
  });

  // An example function for use in the tests below.
  function get<T extends object>(
    someObject: T,
    // Note: A better implementation would use the type `key: keyof T` instead of `key: string`.
    // But that wouldn't make for a very good example for this test since the type checker wouldn't
    // let us pass a `key` that doesn't exist in the object.
    key: string
  ): Option<T[keyof T]> {
    if (key in someObject) {
      return Option.some(someObject[key as keyof T]);
    }
    return Option.none;
  }

  describe("isSome", () => {
    it("should return true for some value", () => {
      const option = get({ a: 4 }, "a");
      const itIsSome = Option.isSome(option);
      expect(itIsSome).toBe(true);

      if (itIsSome) {
        // Check the type was narrowed correctly, and that we can access the value
        option.value;
      }
    });

    it("should return false for none value", () => {
      const option = get({ a: 4 }, "b");
      const itIsSome = Option.isSome(option);
      expect(itIsSome).toBe(false);
    });
  });

  describe("isNone", () => {
    it("should return false for some value", () => {
      const option = get({ a: 4 }, "a");
      const itIsNone = Option.isNone(option);
      expect(itIsNone).toBe(false);

      if (!itIsNone) {
        // Check the type was narrowed correctly, and that we can access the value
        option.value;
      }
    });

    it("should return true for none value", () => {
      const option = get({ a: 4 }, "b");
      const itIsNone = Option.isNone(option);
      expect(itIsNone).toBe(true);

      // If we now tried to access option.value, TypeScript would throw an error, since we have proven it is `None`.
      // Uncomment the code below to see the error.
      // option.value;
    });
  });

  describe("assertSome", () => {
    it("should throw when asserting none", () => {
      const option = get({ a: 4 }, "b");
      expect(() => {
        Option.assertSome(option);

        // Access option.value to prove to the compiler that we've narrowed the type
        // If we got to this point, we have proven to the type checker that `option` was a `Some`.
        option.value;
      }).toThrow("Expected a Some, but got a None");
    });

    it("should not throw when asserting some", () => {
      const option = get({ a: 4 }, "a");
      Option.assertSome(option);

      // Access option.value to prove to the compiler that we've narrowed the type to a `Some`
      option.value;
    });
  });

  describe("assertNone", () => {
    it("should throw when asserting some", () => {
      const option = get({ a: 4 }, "a");
      expect(() => {
        Option.assertNone(option);
      }).toThrow("Expected a None, but got a Some");
    });

    it("should not throw when asserting none", () => {
      const option = get({ a: 4 }, "b");
      Option.assertNone(option);

      // If we now tried to access option.value, TypeScript would throw an error, since we have proven it is `None`.
      // Uncomment the code below to see the error.
      //   option.value;
    });
  });
});
