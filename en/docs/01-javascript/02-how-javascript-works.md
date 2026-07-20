# How JavaScript runs

## Theory

### The full lifecycle of a JavaScript file

The lifecycle of a JavaScript file is its path from the source text to the execution result.

First the runtime receives the command to run the file. In Node.js this happens through the command `node app.js`. Node.js finds the file, reads its contents and passes the text to the JavaScript engine.

Then the engine begins to work.

V8 is the JavaScript engine used in Node.js and Chrome; it was introduced in the previous chapter.

Runtime APIs are the capabilities of the environment, for example `console` or `process`; individual APIs will be studied when they are needed.

Important:

```text
Before execution, the engine does not "perform the program's actions".
It checks and prepares the code.
```

### Source code

Source code is the original text of the program.

For the engine, the file `app.js` first looks like a sequence of characters:

```javascript
console.log('Hello');
```

At the file level this is just text:

```text
c o n s o l e . l o g ( ' H e l l o ' ) ;
```

A human immediately sees "print Hello" in it. The engine must first turn the text into a structure it can work with.

What the engine is doing right now:

```text
The engine is not running anything yet.
The engine receives the text of the program.
```

### Lexical analysis

Lexical analysis is the stage at which the source code is split into meaningful elements.

These elements are often called tokens. A token is the smallest meaningful part of a program: a name, a string, a number, an operator, a bracket, a semicolon.

The detailed theory of tokenization is not needed in this chapter. The important thing is to grasp the idea: the engine stops seeing a stream of individual characters and starts seeing elements of the language.

Example:

```javascript
console.log('Hello');
```

What the engine is doing right now:

```text
The engine reads the characters.
The engine groups them into tokens.
The engine is not running the program yet.
```

If the characters do not form valid elements of the language, the engine cannot move on.

### Parsing

Parsing is the stage at which the engine checks whether the tokens combine into a correct program structure.

Lexical analysis answers the question:

```text
Which elements are in the code?
```

Parsing answers a different question:

```text
Can a correct program be built from these elements?
```

The grammar of the language is the set of rules by which JavaScript elements can be connected to each other; the grammar will emerge gradually in the chapters on syntax.

What the engine is doing right now:

```text
The engine checks the structure of the program.
The engine looks for syntax violations.
The engine prepares an internal representation of the code.
```

### Abstract Syntax Tree

The Abstract Syntax Tree, or AST, is a tree representation of the program.

The AST is not text. It is an internal structure that shows which parts a program consists of and how those parts are connected.

This is not the exact AST of a particular engine. It is a learning model that shows the idea: the text turns into a tree.

Why a tree is needed:

* it is easier for the engine to analyze the structure;
* you can understand the order of nesting;
* you can tell a call apart from a string, a name from an argument, an expression from a statement;
* later stages can work with the structure rather than the text.

An expression is a fragment of code that produces a value; expressions will be studied later.

A statement is an instruction of the program; statements will be studied in the following chapters.

What the engine is doing right now:

```text
The engine has already understood the form of the program.
The engine is not running the user's logic yet.
The engine holds an internal tree of the code.
```

### Syntax errors

A syntax error is an error that occurs when the code does not conform to the grammar of the language.

Example:

```javascript
console.log('Hello'
```

Here the bracket is not closed.

The engine cannot build a correct AST because the structure is incomplete.

What the engine is doing right now:

```text
The engine tries to build the AST.
The engine sees that the structure is broken.
The engine stops preparing the program.
Execution does not begin.
```

Important:

```text
A syntax error occurs before the code runs.
If the parser did not build the AST, the program did not reach execution.
```

This means that the lines below a syntax error are not executed.

### Compilation at a high level

Compilation is the transformation of code into a form more convenient for execution.

In the classic sense a compiler turns source code into machine code or another executable form in advance. In JavaScript it is more complex, because modern engines use a combination of approaches.

At a high level:

An intermediate representation is a representation of the program convenient for the engine; the details of specific engines are not the main topic of this course.

Bytecode is an intermediate instruction for the engine's virtual machine; the exact format depends on the engine.

What the engine is doing right now:

```text
The engine transforms the AST into a more executable form.
The engine prepares the program for fast execution.
The engine still does not have to perform the user's actions.
```

### Interpretation vs compilation

Interpretation is an approach in which the program runs closer to its source representation, step by step.

Compilation is an approach in which the program is transformed into a lower-level form in advance.

Modern JavaScript engines use a mixed model. They can quickly start execution with an interpreter, and additionally optimize frequently executed code with a compiler.

Optimization is a transformation of the code by the engine so that it runs faster; the details of optimizations will be studied later in the advanced section.

What the engine is doing right now:

```text
The engine chooses an efficient execution strategy.
The engine may combine interpretation and compilation.
The details depend on the specific engine.
```

### Modern JavaScript engines

A modern JavaScript engine is not a simple line-by-line reader.

It usually includes several subsystems.

The names and internals differ between engines, but the general idea is preserved: the engine must understand the code, represent it structurally, prepare it for execution and run it.

For this chapter you do not need to memorize the names of V8's internal components. What matters is understanding the pipeline.

What the engine is doing right now:

```text
The engine acts as a system of stages.
Each stage solves its own task.
An error at an early stage stops the later stages.
```

### Preparation for execution

Preparation for execution is preparing the program for the start of execution.

At this level the engine has already:

* received the source code;
* split it into tokens;
* checked the syntax;
* built the AST;
* prepared an executable representation.

But before the actual execution, the runtime must provide the environment.

Timers are an API for deferred actions; the detailed behavior of timers and the Event Loop will be studied in the async section.

The Execution Context is the internal environment for running code; it will be covered in detail in the next chapter. In this chapter we do not go into its internal phases.

What the engine is doing right now:

```text
The engine is ready to move from preparation to execution.
The runtime provides the available APIs.
The next stage is execution.
```

### Execution

Execution is the stage at which the prepared code begins to run.

Now the program is no longer just being analyzed. It performs actions:

* it evaluates expressions;
* it calls available operations;
* it accesses runtime APIs;
* it prints data to the terminal;
* it may finish successfully or with a runtime error.

A runtime error is an error that occurs while the program runs; errors will be studied in a dedicated chapter.

What the engine is doing right now:

```text
The engine runs the prepared program.
If the code accesses a runtime API, the engine passes the request to the runtime.
```

### Runtime interaction

Runtime interaction is the moment when the running JavaScript accesses the capabilities of the environment.

For example:

```javascript
console.log('Hello');
```

`console.log` is used here only as a minimal way to see the result. Functions and calls will be studied in detail later.

Runtime interaction can be different.

The DOM is the structure of an HTML page available to the browser; it will come up in detail in the Playwright section.

What the engine is doing right now:

```text
The engine runs the code.
The runtime provides an external capability.
The result appears outside the language itself.
```

### Result of execution

The result of execution is not always printed text.

The result can be:

* the successful completion of the program;
* output to the terminal;
* a changed runtime state;
* a created file;
* a sent request;
* a runtime error.

In this chapter we use output to the terminal, because it is the easiest to observe.

What the engine is doing right now:

```text
The engine finishes execution or reports an error.
The runtime returns an observable result to the user.
```

---

## Internal mechanism

The internal mechanism of running `node app.js` can be pictured as a chain of checks and transformations.

First the Node.js runtime works. Then the engine works. Then the runtime is noticeable again.

A side effect is an observable change outside the computation itself, for example output to the terminal or writing a file; side effects will be discussed later when studying functions and test architecture.

The main difference:

If the file contains a syntax error, the engine cannot build a correct AST. This means the program does not start running.

If the syntax is correct but during execution the code accesses an unavailable API or a non-existent name, that is a different category of problem.

---

## Mental model

Picture the engine as a technical editor and performer rolled into one.

At first it does not perform your instructions. It checks whether the document can even be read as a program.

```text
1. Receive the text
2. Split the text into elements
3. Check the grammar
4. Build a tree of meaning
5. Prepare an executable form
6. Begin execution
7. Access the runtime when needed
8. Return the result
```

The mental movie after `node app.js`: the text is read, split into tokens, checked, turned into a tree, prepared and then executed.

If the structure is broken at any early stage, the movie stops before execution.

---

## Code examples

The examples for this chapter live in the `examples/01-javascript/chapter-02/` folder. Run the commands from the project root.

### Example 1. A correct program

```bash
node examples/01-javascript/chapter-02/01-valid-program.js
```

This example shows the normal path: the source code successfully passes parsing, the engine begins execution, and the runtime prints the result to the terminal.

### Example 2. Syntax error

```bash
node examples/01-javascript/chapter-02/02-syntax-error.js
```

This example deliberately contains a syntax error. It is there to show an important behavior: the first line of the file does not run, because the engine stops before execution.

### Example 3. Engine flow

```bash
node examples/01-javascript/chapter-02/03-engine-flow.js
```

The example shows the observable result of a successful preparation: if the output appeared, the file has already passed the early stages of the engine pipeline.

### Example 4. Runtime flow

```bash
node examples/01-javascript/chapter-02/04-runtime-flow.js
```

The example shows that the visible output appears through a runtime API.

### Example 5. A conceptual AST

The file `05-ast-visualization.md` is not a runnable JavaScript file but a hand-drawn AST diagram. It is there to reinforce the model `source code → tree`.

---

## FAQ

### Does JavaScript run line by line?

Not in the literal sense.

The engine first analyzes and prepares the code. During execution the actions do have an order, but before that lexical analysis, parsing and preparation have already happened.

### Can you see the AST in Node.js?

Node.js does not show the AST with an ordinary run command. The AST can be built with special tools, but in this chapter we use only a conceptual, hand-drawn picture.

### Are a syntax error and a runtime error the same thing?

No.

A syntax error occurs when the engine cannot parse the program. A runtime error occurs while an already-parsed program runs.

### Do I need to know V8 internals right now?

No.

You need to understand the general engine pipeline. Specific V8 optimizations will only matter in advanced topics.

### Where is the Execution Context here?

The Execution Context is the internal environment for running code. It will be studied in the next chapter, because first you need to understand the general path of a file up to execution.

---

## Common myths

### Myth 1. JavaScript just reads the file top to bottom

Reality:

Before running, the engine analyzes the source code, builds the AST and prepares the code for execution.

### Myth 2. If there is a syntax error at the bottom of the file, the upper lines will still run

Reality:

If the parser cannot build the AST for the program, execution does not begin.

### Myth 3. Compilation does not apply to JavaScript

Reality:

Modern JavaScript engines use compilation and optimization as part of execution, even though JavaScript is often called an interpreted language.

### Myth 4. All errors appear during execution

Reality:

Syntax errors appear before execution. Runtime errors appear during execution.

---

## Common mistakes

### Mistake 1. Looking for a runtime cause in a syntax error

What happened:

The category of the error is identified incorrectly.

Why it happened:

Parsing is not separated from execution.

The corrected approach: first determine whether the parser was even able to build the AST.

### Mistake 2. Thinking the AST is just a fancy word for code

What happened:

The AST is treated as a text format.

Why it happened:

The model "text turns into a tree" was not built.

The corrected model: the AST is a structure, not formatted text.

### Mistake 3. Confusing engine compilation with TypeScript compilation

What happened:

Compilation inside the JavaScript engine is confused with the compilation of TypeScript into JavaScript.

Why it happened:

The same word is used in different contexts.

The corrected model:

TypeScript compilation will be studied in the TypeScript part.

### Mistake 4. Ignoring the stage at which the error occurred

The wrong question:

```text
Why does the code not work?
```

A more precise question:

```text
At which stage of the pipeline did the engine stop?
```

Such a question immediately guides the diagnosis.

---

## Practical use

For any error running a JavaScript file, use the pipeline as a diagnostic map.

```text
1. Did Node.js find the file?
2. Was the source code read?
3. Is the syntax correct?
4. Can the AST be built?
5. Did execution begin?
6. Did the error occur during runtime interaction?
```

A ReferenceError is an error from accessing a name that is not available at the current point of execution; names and Scope will be studied later.

---

## Use in Automation QA

An Automation QA Engineer often sees errors not in a learning file, but in a test project.

`npx` is a tool for running npm packages; npm tools will be studied later.

If a test file has a syntax error, Playwright may not even start running the scenario. The browser may not open, because the error happened earlier: the engine or the toolchain could not prepare the file.

A toolchain is the chain of tools that processes the code before running; it will come up in the TypeScript and Playwright sections.

QA diagnosis through the pipeline helps you not confuse:

* a syntax error in the test file;
* an error running the tool;
* a runtime error;
* a browser-interaction error;
* an assertion error.

An assertion is a check of an expected result; assertions will be studied in the Automation QA section.

In good automation it is important to understand not only "the test is red", but also "at which stage it turned red".

---

## Summary

After the command `node app.js`, a JavaScript file goes through several stages.

First the Node.js runtime finds and reads the file. Then the JavaScript engine receives the source code. The engine performs lexical analysis, splits the text into tokens, runs the parser, checks the grammar and builds the AST. If the syntax is broken, execution does not begin.

If the AST is built successfully, the engine prepares the code for execution. Modern JavaScript engines use a combination of interpretation, compilation and optimization. After preparation, execution begins, and the code can interact with runtime APIs.

The next chapter will explain the Execution Context — the internal environment in which JavaScript runs code after preparation.

---

## What to remember

✓ A JavaScript file does not start performing actions immediately.

✓ The engine first receives the source code.

✓ Lexical analysis splits the text into tokens.

✓ Parsing checks the structure of the program.

✓ The AST is a tree representation of the code.

✓ A syntax error occurs before execution.

✓ Compilation in the engine prepares the code for execution.

✓ Modern engines combine interpretation and compilation.

✓ Execution begins after successful preparation.

✓ Runtime interaction happens when the code accesses the environment's APIs.

---

## Check yourself

1. What happens after the command `node app.js` before the engine works?

2. What is source code?

3. Why is lexical analysis needed?

4. How does parsing differ from lexical analysis?

5. What is an AST?

6. Why does a syntax error occur before execution?

7. How does interpretation differ from compilation?

8. What does the engine do during preparation for execution?

9. What is runtime interaction?

10. How does the pipeline help in diagnosing tests?
