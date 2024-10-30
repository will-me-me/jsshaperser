const { ShapeParser, Container, Square, Circle } = require("./main");

describe("ShapeParser", () => {
  let parser;

  beforeEach(() => {
    parser = new ShapeParser();
  });

  test("parses a single square correctly", () => {
    const result = parser.parse("[12]");
    expect(result).toBeInstanceOf(Container);
    expect(result.shapes.length).toBe(1);
    expect(result.shapes[0]).toBeInstanceOf(Square);
    expect(result.shapes[0].label).toBe("12");
  });

  test("parses a single circle correctly", () => {
    const result = parser.parse("(ABC)");
    expect(result).toBeInstanceOf(Container);
    expect(result.shapes.length).toBe(1);
    expect(result.shapes[0]).toBeInstanceOf(Circle);
    expect(result.shapes[0].label).toBe("ABC");
  });

  test("parses nested squares correctly", () => {
    const result = parser.parse("[1[2[3]]]");
    expect(result.shapes.length).toBe(1);
    expect(result.shapes[0].label).toBe("1");
    expect(result.shapes[0].children[0].label).toBe("2");
    expect(result.shapes[0].children[0].children[0].label).toBe("3");
  });

  test("parses nested circles correctly", () => {
    const result = parser.parse("(A(B(C)))");
    expect(result.shapes.length).toBe(1);
    expect(result.shapes[0].label).toBe("A");
    expect(result.shapes[0].children[0].label).toBe("B");
    expect(result.shapes[0].children[0].children[0].label).toBe("C");
  });

  test("parses complex nested structure correctly", () => {
    const result = parser.parse("[12](BALL(INK[1[35]](CHARLIE)))");
    expect(result.shapes.length).toBe(2);
    expect(result.shapes[0]).toBeInstanceOf(Square);
    expect(result.shapes[1]).toBeInstanceOf(Circle);
    expect(result.shapes[1].children[0].children[0]).toBeInstanceOf(Square);
    expect(result.shapes[1].children[0].children[1]).toBeInstanceOf(Circle);
  });

  test("throws error for invalid square label", () => {
    expect(() => parser.parse("[ABC]")).toThrow(
      "Invalid label for square: ABC"
    );
  });

  test("throws error for invalid circle label", () => {
    expect(() => parser.parse("(123)")).toThrow(
      "Invalid label for circle: 123"
    );
  });

  test("throws error for unclosed square bracket", () => {
    expect(() => parser.parse("[123")).toThrow("Unclosed square bracket");
  });

  test("throws error for unclosed circle parenthesis", () => {
    expect(() => parser.parse("(ABC")).toThrow("Unclosed circle parenthesis");
  });

  test("throws error for invalid character in square", () => {
    expect(() => parser.parse("[1(A)]")).toThrow(
      "Invalid character in square: ("
    );
  });

  test("throws error for unexpected character", () => {
    expect(() => parser.parse("123")).toThrow("Unexpected character: 1");
  });

  test("handles empty input", () => {
    const result = parser.parse("");
    expect(result).toBeInstanceOf(Container);
    expect(result.shapes.length).toBe(0);
  });

  test("parses multiple top-level shapes", () => {
    const result = parser.parse("[1](A)[2](B)");
    expect(result.shapes.length).toBe(4);
    expect(result.shapes[0]).toBeInstanceOf(Square);
    expect(result.shapes[1]).toBeInstanceOf(Circle);
    expect(result.shapes[2]).toBeInstanceOf(Square);
    expect(result.shapes[3]).toBeInstanceOf(Circle);
  });

  test("throws error for invalid nesting of squares in circles", () => {
    expect(() => parser.parse("(A[1])")).toThrow(
      "Invalid character in circle: ["
    );
  });
});
