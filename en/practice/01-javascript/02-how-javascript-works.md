# Practice. Chapter 5. How JavaScript runs

## Comprehension check

Answer in your own words.

1. What happens after the command `node app.js` before execution begins?
2. What is source code?
3. What does the engine do during lexical analysis?
4. How does parsing differ from lexical analysis?
5. What is an AST?
6. Why does a syntax error stop the program before execution?
7. How does interpretation differ from compilation?
8. What does preparation for execution mean?
9. What is runtime interaction?
10. Why must an Automation QA Engineer understand the stage at which an error occurred?

## Code reading

Read the code.

```javascript
console.log('Program started');
console.log('Program finished');
```

Answer:

1. Which stages must the file go through before the first line is printed?
2. When does execution begin?
3. Which runtime API is used for the observable result?

## Predict the result. Task 1

Before running, predict the output of the file:

```text
examples/01-javascript/chapter-02/01-valid-program.js
```

Command:

```bash
node examples/01-javascript/chapter-02/01-valid-program.js
```

Write down the expected result and explain which stages the engine went through.

## Predict the result. Task 2

Before running, predict whether the first line of the file will run:

```text
examples/01-javascript/chapter-02/02-syntax-error.js
```

Command:

```bash
node examples/01-javascript/chapter-02/02-syntax-error.js
```

Answer:

1. Will the text from the first line be printed?
2. At which stage will the engine stop?
3. Why does execution not begin?

## Finding the syntax error

Find where the error is.

```javascript
console.log('Before');
console.log('After'
```

Answer:

1. What is missing?
2. Why can the parser not build a correct AST?
3. Which line helps you find where the problem is?

## Explain the engine's behavior

For the code:

```javascript
console.log('QA');
```

Describe what the engine does at the stages:

1. source code;
2. lexical analysis;
3. parsing;
4. AST;
5. preparation;
6. execution;
7. runtime interaction.

## Debugging tasks

### Task 1

You see the error:

```text
SyntaxError: missing ) after argument list
```

Answer:

1. Is this an error before execution or during execution?
2. Which stage of the pipeline detected it?
3. What should you check first?

### Task 2

A Playwright test did not open the browser and failed right away because of a `SyntaxError` in the test file.

Answer:

1. Why might the browser not have opened?
2. At which stage did the run stop?
3. Why is this not a locator or assertion error?

## QA tasks

### Task 1

Put together a diagnostic checklist for the situation "the test does not start".

The checklist should distinguish:

* file not found;
* syntax error;
* runtime error;
* browser-interaction error.

### Task 2

Explain why a `SyntaxError` message in CI should be read differently from an assertion failure.

## Mini-project

Create two files in `playground/`:

```text
playground/pipeline-valid.js
playground/pipeline-syntax-error.js
```

The first file should successfully print two lines.

The second file should contain a deliberate syntax error.

For each file, write down:

* the expected result;
* at which stage the engine will stop or continue;
* which output or error will appear;
* which output is useful for Automation QA diagnosis.
