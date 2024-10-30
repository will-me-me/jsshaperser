class Shape {
  constructor(label) {
    this.label = label;
    this.children = [];
  }
}

class Square extends Shape {
  constructor(label) {
    if (!/^\d+$/.test(label)) {
      // Check if the label is numeric
      throw new Error(`Invalid label for square: ${label}`);
    }
    super(label);
  }
}

class Circle extends Shape {
  constructor(label) {
    if (!/^[A-Z]+$/.test(label)) {
      // Check if the label is uppercase
      throw new Error(`Invalid label for circle: ${label}`);
    }
    super(label);
  }
}

class Container {
  constructor() {
    this.shapes = [];
  }
}

class ShapeParser {
  constructor() {
    this.index = 0;
    this.inputStr = "";
  }

  parse(inputStr) {
    this.inputStr = inputStr;
    this.index = 0;
    return this.parseContainer();
  }

  parseContainer() {
    const container = new Container();
    while (this.index < this.inputStr.length) {
      const char = this.inputStr[this.index];
      if (char === "[") {
        container.shapes.push(this.parseSquare());
      } else if (char === "(") {
        container.shapes.push(this.parseCircle());
      } else {
        throw new Error(`Unexpected character: ${char}`);
      }
    }
    return container;
  }

  parseSquare() {
    this.index++;
    const label = this.readLabel();
    const square = new Square(label);

    while (
      this.index < this.inputStr.length &&
      this.inputStr[this.index] !== "]"
    ) {
      if (this.inputStr[this.index] === "[") {
        square.children.push(this.parseSquare());
      } else {
        throw new Error(
          `Invalid character in square: ${this.inputStr[this.index]}`
        );
      }
    }

    if (
      this.index >= this.inputStr.length ||
      this.inputStr[this.index] !== "]"
    ) {
      throw new Error("Unclosed square bracket");
    }

    this.index++;
    return square;
  }

  parseCircle() {
    this.index++;
    const label = this.readLabel();
    const circle = new Circle(label);

    while (
      this.index < this.inputStr.length &&
      this.inputStr[this.index] !== ")"
    ) {
      if (this.inputStr[this.index] === "(") {
        circle.children.push(this.parseCircle());
      } else if (this.inputStr[this.index] === "[") {
        circle.children.push(this.parseSquare());
      } else {
        throw new Error(
          `Invalid character in circle: ${this.inputStr[this.index]}`
        );
      }
    }

    if (
      this.index >= this.inputStr.length ||
      this.inputStr[this.index] !== ")"
    ) {
      throw new Error("Unclosed circle parenthesis");
    }

    this.index++;
    return circle;
  }

  readLabel() {
    let start = this.index;
    while (
      this.index < this.inputStr.length &&
      /\w/.test(this.inputStr[this.index])
    ) {
      this.index++;
    }
    return this.inputStr.slice(start, this.index);
  }
}

const parser = new ShapeParser();

try {
  const validInput = "[12](BALL(INK[1[35]](CHARLIE)))";
  const validInputtry = "[13]";
  const validinputtrytwo = "(DOG[15])";
  const container = parser.parse(validInput);
  const containertry = parser.parse(validInputtry);
  const containertrytwo = parser.parse(validinputtrytwo);
  console.log(container);
  console.log(containertry);
  console.log(containertrytwo);

  // Test invalid input cases
  const invalidInput = "[72(HELLO)]"; // Invalid inner shape
  const invalidContainer = parser.parse(invalidInput);
  console.log(invalidContainer);
} catch (error) {
  console.error(`Error: ${error.message}`);
}

module.exports = { ShapeParser, Container, Square, Circle };
