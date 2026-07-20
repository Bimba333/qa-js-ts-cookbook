# Solutions. Chapter 5. How JavaScript runs

## Comprehension check

### 1. What happens after `node app.js`

Answer:

Node.js finds the file, reads the source code and passes it to the JavaScript engine. The engine performs lexical analysis, parsing, builds the AST, prepares the code and only then begins execution.

Explanation:

The file does not run immediately as text. First the engine must understand that it is a correct program.

A common mistake:

Thinking that Node.js runs the first line of the file right away.

Connection to Automation QA:

If a test did not start because of a syntax error, the scenario has not started running yet.

### 2. Source code

Answer:

Source code is the original text of the program.

Explanation:

For a human it is code. For the engine it is at first a stream of characters that needs to be parsed.

A common mistake:

Assuming the engine immediately "understands the meaning" of the code without intermediate stages.

### 3. Lexical analysis

Answer:

Lexical analysis splits the source code into tokens.

Explanation:

The engine groups characters into meaningful elements: names, strings, brackets, operators.

A common mistake:

Confusing lexical analysis with execution.

### 4. Parsing

Answer:

Parsing checks whether the tokens form a correct program structure.

Explanation:

Tokens can be recognized but arranged incorrectly. The parser checks the grammar.

A common mistake:

Thinking that if the tokens are recognized, the program can already run.

### 5. AST

Answer:

The AST is a tree-shaped internal representation of the program's structure.

Explanation:

The engine works not only with text. The tree shows the connections between the parts of the program.

A common mistake:

Imagining the AST as simply formatted source code.

### 6. Syntax error before execution

Answer:

A syntax error occurs before execution because the parser cannot build a correct AST.

Explanation:

If the structure of the program is broken, the engine cannot move on to preparation and execution.

Connection to Automation QA:

A syntax error in a test file means the test scenario has not started running.

### 7. Interpretation and compilation

Answer:

Interpretation runs the program closer to an intermediate representation, step by step. Compilation transforms the code into a more executable form in advance or during execution.

Explanation:

Modern engines combine the approaches: they can start execution quickly and optimize frequently used code.

A common mistake:

Saying that JavaScript "is only interpreted" and compilation does not apply to it.

### 8. Preparation for execution

Answer:

Preparation for execution is the stage at which the engine has already parsed the code and is preparing it to run.

Explanation:

At this stage the program is not necessarily performing the user's actions yet.

### 9. Runtime interaction

Answer:

Runtime interaction is the running code accessing the environment's capabilities, for example `console`.

Explanation:

The engine runs the JavaScript, but the output to the terminal is provided by the runtime API.

Connection to Automation QA:

In Playwright, runtime interaction can mean interacting with the browser through the tool's API.

### 10. Why a QA engineer needs to understand the error stage

Answer:

To tell apart a file-loading error, a syntax error, a runtime error and a test-check error.

Explanation:

Different stages require different actions. A syntax error is not fixed by waiting for an element on the page.

## Code reading

The code:

```javascript
console.log('Program started');
console.log('Program finished');
```

Answer:

Before the first line is printed, the file goes through reading the source code, lexical analysis, parsing, building the AST and preparation for execution.

Execution begins after successful preparation.

The runtime API `console` is used for the observable result.

Explanation:

Both lines are printed only if the parser was able to parse the whole file.

A common mistake:

Thinking that the first line is printed before the syntax of the second line is checked.

Connection to Automation QA:

If there is a syntax error lower in the test file, the upper part of the test will not run either.

## Predict the result. Task 1

File:

```text
examples/01-javascript/chapter-02/01-valid-program.js
```

Expected output:

```text
Program started
Program finished
```

Explanation:

The file is syntactically correct. The engine builds the AST, prepares the code, execution begins, and then two calls to `console.log` print two lines.

A common mistake:

Skipping the preparation stage and explaining the result only as "Node.js read the lines".

## Predict the result. Task 2

File:

```text
examples/01-javascript/chapter-02/02-syntax-error.js
```

Answer:

The first line will not be printed.

The engine will stop at the parsing / AST construction stage.

Execution does not begin because the parser cannot build a correct program structure due to the unclosed bracket.

A common mistake:

Expecting the first line to run because it is above the error.

Connection to Automation QA:

The same applies to test files: a syntax error at the bottom of a file can stop the whole file before the first test runs.

## Finding the syntax error

The code:

```javascript
console.log('Before');
console.log('After'
```

Answer:

The closing bracket `)` is missing.

The parser cannot build a correct AST because the call is not complete.

The problem line:

```javascript
console.log('After'
```

Explanation:

There is an opening bracket, but no closing one. The structure of the expression is incomplete.

A common mistake:

Looking for the problem in the line above, because it would run first.

## Explain the engine's behavior

The code:

```javascript
console.log('QA');
```

Answer:

1. Source code: the engine receives the text `console.log('QA');`.
2. Lexical analysis: the text is split into tokens.
3. Parsing: the parser checks the grammar.
4. AST: a tree of the `console.log` call is built.
5. Preparation: the engine prepares the code for execution.
6. Execution: the statement begins to run.
7. Runtime interaction: `console` prints the text to the terminal.

Explanation:

The output appears only at the last stage. Before that the engine analyzes and prepares the program.

A common mistake:

Treating `console.log` as part of the parsing stage.

Connection to Automation QA:

It is useful to separate "the test did not parse" from "the test started running and printed a log".

## Debugging tasks

### Task 1

The error:

```text
SyntaxError: missing ) after argument list
```

Answer:

This is an error before execution.

The parser detected it.

You should first check the structure of the code: brackets, quotes, commas, closing of expressions.

Explanation:

The parser could not build the AST. The runtime APIs did not run yet.

A common mistake:

Re-running the test or changing the Playwright expectations when the problem is in the syntax.

### Task 2

Answer:

The browser might not have opened because the test file did not pass parsing.

The run stopped before the execution of the test scenario.

This is not a locator or assertion error, because those relate to a test that is already running.

Explanation:

If the engine did not build the AST, Playwright does not receive a correct runnable test.

Connection to Automation QA:

In CI this looks like "the tests did not start", not like "the tests failed on a check".

## QA tasks

### Task 1

Checklist:

```text
1. Is the file found?
2. Does the run command point to the correct path?
3. Is there a SyntaxError?
4. If there is a SyntaxError, check the structure of the code.
5. If the syntax is correct, did execution begin?
6. If execution began, which runtime error appeared?
7. If the browser opened, check the interaction with Playwright.
8. If a check failed, analyze the assertion.
```

Explanation:

The checklist goes along the pipeline from running the file to the test logic.

A common mistake:

Starting the diagnosis with the browser when the file has not been parsed yet.

### Task 2

Answer:

A `SyntaxError` in CI means the code did not pass parsing. An assertion failure means the test was already running and a check received an unexpected result.

Explanation:

These are different stages of the pipeline. For a `SyntaxError` you need to fix the structure of the code. For an assertion you need to analyze the actual and expected result.

Connection to Automation QA:

Such a distinction helps you correctly classify failures in the report.

## Mini-project

The first file:

```text
playground/pipeline-valid.js
```

Code:

```javascript
console.log('Pipeline started');
console.log('Pipeline finished');
```

Expected result:

```text
Pipeline started
Pipeline finished
```

The engine goes through all the stages and reaches execution.

The second file:

```text
playground/pipeline-syntax-error.js
```

Code:

```javascript
console.log('This will not be printed');
console.log('Broken'
```

Expected result:

```text
SyntaxError
```

The first line will not be printed, because the parser cannot build the AST for the file.

Explanation:

In the first file the pipeline reaches runtime interaction. In the second file the pipeline stops at the parsing stage.

A common mistake:

Expecting partial execution of a file with a syntax error.

Connection to Automation QA:

This is a model for diagnosing a test file: a syntax error blocks the whole file before the test scenario begins.

## Possible improvements

After completing the practice you can:

* draw your own diagram `source code → tokens → AST → execution`;
* save an example of a syntax error and its explanation in your personal notes;
* compare a syntax error and a runtime error in two separate files;
* use the pipeline as a checklist when analyzing test failures.
