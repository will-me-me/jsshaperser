## Installation

1. Install any dependencies (if required):

   ```bash
   npm install
   ```

2. Run the code using Node.js:
   ```bash
   node main.js
   ```

### Explanation of the Code

this code defines a **Shape Parser** that can parse custom shapes (squares and circles) from an input string, ensuring that the parsed structure follows specific rules. It is designed to interpret the custom syntax of **squares** and **circles**, which can be nested within each other.

#### 1. **Classes**

1. **Shape Class (Base Class)**:

   - This is a base class for all shapes (`Square` and `Circle`).
   - Each shape has a **label** (a string or number) and an array called `children`, which stores any nested shapes.

   ```javascript
   class Shape {
     constructor(label) {
       this.label = label;
       this.children = [];
     }
   }
   ```

2. **Square Class (Inherits from Shape)**:

   - **Square** inherits from `Shape` and represents a square.
   - It validates that the label is numeric (using a regular expression to ensure the label consists only of digits).
   - If the label is invalid, it throws an error.

   ```javascript
   class Square extends Shape {
     constructor(label) {
       if (!/^\d+$/.test(label)) {
         throw new Error(`Invalid label for square: ${label}`);
       }
       super(label);
     }
   }
   ```

3. **Circle Class (Inherits from Shape)**:

   - **Circle** inherits from `Shape` and represents a circle.
   - It validates that the label consists only of uppercase alphabetic letters.
   - If the label is invalid, it throws an error.

   ```javascript
   class Circle extends Shape {
     constructor(label) {
       if (!/^[A-Z]+$/.test(label)) {
         throw new Error(`Invalid label for circle: ${label}`);
       }
       super(label);
     }
   }
   ```

4. **Container Class**:
   - This class represents a container for storing all the top-level shapes.
   - The `shapes` array holds the parsed shapes.
   ```javascript
   class Container {
     constructor() {
       this.shapes = [];
     }
   }
   ```

#### 2. **ShapeParser Class**

The **ShapeParser** class is responsible for parsing the input string character by character and building the structure of shapes.

```javascript
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
```

### **Key Methods**:

1. **`parse()`**:

   - Initializes the input string and index, and starts parsing by calling `parseContainer()`.

2. **`parseContainer()`**:

   - Iterates through the input string, and depending on whether it encounters a square bracket (`[`) or a parenthesis (`(`), it parses either a square or a circle.
   - It adds the parsed shapes to the container.

3. **`parseSquare()`**:

   - Parses a square, validates its label, and recursively handles nested squares.
   - Throws an error if an unexpected character is found or if the square is unclosed.

4. **`parseCircle()`**:

   - Parses a circle, validates its label, and recursively handles nested circles and squares.
   - Throws an error if an unexpected character is found or if the circle is unclosed.

5. **`readLabel()`**:
   - Reads and returns the label of a shape (either numeric for squares or alphabetic for circles).

### **Example Usage**:

```javascript
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
```

### **Explanation of Example**:

1. **Valid Inputs**:

   - The string `"[12](BALL(INK[1[35]](CHARLIE)))"` is parsed into a container of shapes. It includes a square labeled "12" and a circle labeled "BALL" containing nested shapes.
   - `"[13]"` is parsed as a square with label "13".
   - `"(DOG[15])"` is parsed as a circle with label "DOG" containing a nested square labeled "15".

2. **Invalid Input**:
   - The string `"[72(HELLO)]"` is invalid because a square cannot contain a circle. This triggers an error, which is caught and printed.

---

### **README File**

# Shape Parser in JavaScript

## Introduction

This project is a **Shape Parser** written in JavaScript that parses a custom syntax of shapes, including **squares** and **circles**, from a string input. The parser reads the input and constructs a tree-like structure of shapes while validating the input based on specified rules.

### Features:

- **Square**: Represented by square brackets `[ ]` and must have numeric labels.
- **Circle**: Represented by parentheses `( )` and must have uppercase alphabetic labels.
- **Nesting**: Squares can only contain other squares, while circles can contain both squares and circles.

## Usage

The parser can be used to parse a string that represents shapes:

1. **Example of a valid input**:

   ```javascript
   const validInput = "[12](BALL(INK[1[35]](CHARLIE)))";
   const container = parser.parse(validInput);
   console.log(container);
   ```

   This input contains:

   - A square labeled "12".
   - A circle labeled "BALL", which contains nested shapes.

2. **Example of an invalid input**:

   ```javascript
   const invalidInput = "[72(HELLO)]"; // Invalid nesting
   const container = parser.parse(invalidInput);
   ```

   This input is invalid because a square cannot contain a circle. The parser will throw an error.

## Class Overview

### `Shape`

The base class for shapes, holding a label and an array of children.

### `Square`

Represents a square shape, extending from `Shape`. It validates that the label is numeric.

### `Circle`

Represents a circle shape, extending from `Shape`. It validates that the label is uppercase alphabetic.

### `Container`

Holds all the top-level shapes that are parsed.

### `ShapeParser`

Handles the logic of parsing the input string into the corresponding shape objects.

## Error Handling

The parser throws descriptive errors in the following situations:

- **Unexpected characters** in the input string.
- **Invalid labels** for squares or circles.
- **Unclosed shapes** (either missing `]

`for squares or`)` for circles).

## Running Tests

Unit tests can be added using a testing framework like **Jest**. Ensure that the parser handles both valid and invalid inputs.

## Running the test

```
npx jest

```
