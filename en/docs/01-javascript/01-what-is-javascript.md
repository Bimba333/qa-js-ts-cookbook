# What is JavaScript

## Theory

### What is JavaScript

JavaScript is a programming language.

A programming language defines the rules for describing actions for a computer: which constructs exist, how expressions are written, how values are created, how code is called and how a program should behave.

This chapter does not cover variables, functions, objects, scope, hoisting, promises or the event loop. Those topics will be worked through in detail in the following chapters. For now the important thing is to understand where JavaScript sits in the overall system.

JavaScript can be pictured as a set of rules:

Syntax is the set of rules for writing code; the syntax will be introduced gradually.

Value is the data a program works with; value types will be studied in the section on variables and types.

Function is a block of code that can be called; functions will be studied separately.

Object is a compound value with a set of properties; objects will be studied in a dedicated section.

For now these terms are only signposts. It is too early to dig into them deeply.

### Why JavaScript was created

JavaScript was created for the browser.

The original problem was practical: web pages were mostly static. HTML made it possible to describe the structure of a page and CSS its appearance, but there was no language that could react to user actions directly in the browser.

There was a need to:

* validate forms before sending them to the server;
* react to clicks;
* change the content of a page;
* make the interface more interactive;
* run simple logic close to the user.

JavaScript appeared as a language for the behavior of web pages.

Later JavaScript moved beyond the browser. Node.js appeared, and the language began to be used for server applications, developer tools, CLI utilities, project builds, testing and Automation QA.

A CLI utility is a program launched from the terminal; such tools will come up in the practical sections.

### Why JavaScript became widely used

JavaScript became widely used for several reasons.

The first reason: the browser became a universal platform. If a language is built into browsers, it is automatically available on a huge number of devices.

The second reason: JavaScript solved a real interactivity problem. It let a page react to the user without a full reload.

The third reason: the development of engines made JavaScript execution faster. An engine is a program that reads and runs JavaScript code; the engine is discussed in more detail below.

The fourth reason: Node.js made it possible to use JavaScript outside the browser. That made the language useful not only for pages, but also for tools, servers, tests and automation.

The fifth reason: a large ecosystem of packages and tools grew around JavaScript. An ecosystem is the set of libraries, frameworks and utilities around a language; working with packages will be studied later.

For Automation QA this means that JavaScript became not only the language of web pages, but also the language of test infrastructure.

### What is ECMAScript

ECMAScript is the standard for the language.

The standard describes how the language itself should work: which constructs exist, how they behave, which built-in capabilities must be available.

JavaScript is the practical implementation of the language that follows the ECMAScript standard and runs in specific environments.

It is important to distinguish:

* ECMAScript defines the core of the language;
* JavaScript is used as the real language in browsers, Node.js and tools;
* the browser runtime adds browser APIs;
* the Node.js runtime adds Node.js APIs.

An API is the set of capabilities that an environment provides to code; APIs will come up in the chapters on the browser runtime, Node.js and Automation QA.

### ECMAScript and JavaScript

The difference between ECMAScript and JavaScript often looks theoretical, but it matters.

ECMAScript does not describe how to work with an HTML page. It does not define `document`, `window`, buttons, browser tabs or the file system.

ECMAScript describes the language.

The browser adds capabilities for working with the page.

Node.js adds capabilities for working with the system, files and the process.

That is why the same language can have different available capabilities in different runtimes.

### What is a JavaScript Engine

A JavaScript Engine is a program that runs JavaScript code.

The engine reads the code, parses it, prepares it for execution and executes it. Parsing, the AST, compilation and execution will be studied in detail in the next chapter. For now it is enough to understand: the engine is responsible for running the language itself.

Examples of engines:

* V8 — used in Chrome and Node.js;
* SpiderMonkey — used in Firefox;
* JavaScriptCore — used in Safari.

These engines must follow the ECMAScript standard so that the same JavaScript code behaves predictably across different implementations.

Important:

```text
The engine runs the language.
The runtime adds the environment around the engine.
```

### What is a Runtime

A runtime is the environment in which a program executes.

The runtime includes the engine and the additional APIs available to the code.

An environment object is an object the environment provides to the code, for example `window` in the browser or `process` in Node.js; objects will be studied later.

The JavaScript engine is responsible for running the language. The runtime is responsible for which external capabilities the program has.

For example, ECMAScript does not say how to open a file on disk. The Node.js runtime adds that capability.

ECMAScript does not say how to find a button on an HTML page. The browser runtime adds that capability.

### Browser Runtime

The browser runtime is the environment that runs JavaScript inside the browser.

It includes the JavaScript engine and browser APIs.

The DOM API is a set of capabilities for working with the structure of an HTML page; the DOM will come up in Automation QA and browser topics.

The browser runtime gives access to things like:

* `window`;
* `document`;
* the DOM;
* click events;
* page elements;
* part of the Web APIs.

But the browser runtime does not give an ordinary web page direct access to the computer's file system or to the Node.js process.

This restriction is important for security.

### Node.js Runtime

The Node.js runtime is the environment that runs JavaScript outside the browser.

It includes the V8 engine and Node.js APIs.

`fs` is a Node.js API for working with files; it will be studied later, when there is a practical need.

`process` is a Node.js API with information about the current process; it will be used in the topics on configuration and environments.

Modules are a system for splitting code across files; modules will be studied in a dedicated JavaScript section.

The Node.js runtime gives access to:

* the file system;
* file paths;
* environment variables;
* launch arguments;
* npm packages;
* development and testing tools.

But the Node.js runtime does not have `document` and does not control an HTML page directly.

### Why JavaScript works in both the browser and Node.js

JavaScript can run in different places because the language is separate from the runtime.

ECMAScript describes the core of the language. The engine runs that core. The runtime adds a specific environment.

The same base language can run in different environments, as long as there is an engine there.

But the available APIs will differ.

### Browser APIs and Node.js APIs

A browser-only API is a capability that exists in the browser environment but does not exist in an ordinary Node.js file.

Examples:

* `window`;
* `document`;
* working with the DOM;
* page events;
* browser storage.

A Node-only API is a capability that exists in Node.js but does not exist inside an ordinary browser page.

Examples:

* `process`;
* `fs`;
* `path`;
* access to launch arguments;
* working with local files through Node.js.

When code fails with a message that `document` is not defined, the cause is often not the JavaScript syntax. The cause is that the code runs in Node.js, where there is no browser API.

### TypeScript at a high level

TypeScript is a language that adds a type system to JavaScript.

Types help describe expectations about data and functions before the program runs. But TypeScript does not replace JavaScript. After compilation it is JavaScript that runs.

Compilation is the transformation of source code into another form of code; TypeScript compilation will be studied in the TypeScript part.

That is why JavaScript fundamentals come before TypeScript. To understand what TypeScript checks, you need to understand how JavaScript runs.

---

## Internal mechanism

The internal mechanism of this chapter is the separation of responsibilities.

A single JavaScript file does not run on its own. It is run by an engine inside a runtime.

If `document` is available, the code is in an environment that has browser APIs.

If `process` is available, the code is in the Node.js runtime.

If the basic JavaScript syntax is available, that does not yet mean all APIs are available.

`console.log` is used here only as a way to print text; output tools and expressions will come up in the following chapters.

When you see an error, you should ask: where does this code run, and which runtime provides its APIs? That question helps you tell a syntax error apart from an environment error more quickly.

---

## Mental model

Picture JavaScript as the text of an instruction, the engine as the performer of the instruction, and the runtime as the room in which the performer works.

The same performer can read a similar instruction in different rooms, but the available tools will differ.

If you ask the performer to "find a button on the page", that is possible in the browser room.

If you ask them to "read a file from disk", that is possible in the Node.js room.

An error arises not because JavaScript is "bad" or "strange". Often the error arises because the code asked the runtime for an API that is not there.

---

## Code examples

The examples for this chapter live in the `examples/01-javascript/chapter-01/` folder. Run them from the project root.

### Example 1. Node.js runtime

```bash
node examples/01-javascript/chapter-01/01-node-runtime.js
```

This example shows that the file runs in Node.js and can print the Node.js version.

### Example 2. Runtime check

```bash
node examples/01-javascript/chapter-01/02-runtime-check.js
```

The example checks for signs of the Node.js and browser runtimes through safe `typeof` checks.

`typeof` lets you find out the type of a value or check whether a name exists; types will be studied later.

### Example 3. Browser-only API

```bash
node examples/01-javascript/chapter-01/03-browser-only-api.js
```

The example does not access `document` directly. It safely checks whether `document` is available in Node.js. In an ordinary Node.js file the result will show that the browser API is not available.

### Example 4. Node-only API

```bash
node examples/01-javascript/chapter-01/04-node-only-api.js
```

The example shows the Node.js `process` API. On a browser page such an API is usually not available.

---

## Common mistakes

### Mistake 1. Treating JavaScript and browser APIs as the same thing

The wrong expectation:

```text
If it is JavaScript, then document must always be available.
```

What happened:

The JavaScript language and the browser runtime APIs are mixed up.

Why it happened:

`document` often appears in browser JavaScript, but it is not part of the ECMAScript core.

The corrected model:

```text
JavaScript can run in different runtimes.
document is available in the browser runtime, but not in an ordinary Node.js runtime.
```

### Mistake 2. Treating Node.js as a separate language

The wrong phrasing:

```text
Node.js is a different language.
```

What happened:

Node.js is confused with a language.

Why it happened:

Node.js provides special APIs that the browser does not have, so the environment looks like a separate language.

The corrected phrasing:

```text
Node.js is a runtime for running JavaScript outside the browser.
```

### Mistake 3. Not distinguishing the Playwright test context from the browser context

The wrong expectation:

```text
The Playwright test and the code inside page.evaluate have the same environment available.
```

What happened:

The Node.js context of the test and the browser context of the page are mixed up.

Why it happened:

Both fragments are written in JavaScript or TypeScript, but they run in different runtimes.

The corrected model: the test file runs in the Node.js context, while the code inside `page.evaluate` runs in the browser context of the page.

### Mistake 4. Thinking that TypeScript replaces JavaScript

The wrong expectation:

```text
If the project is in TypeScript, you do not need to understand JavaScript.
```

What happened:

TypeScript is treated as a replacement for the JavaScript runtime model.

Why it happened:

Types are visible in the source code, but after compilation it is JavaScript that runs.

The corrected model:

```text
TypeScript helps before running.
The runtime runs JavaScript.
```

---

## Practical use

After this chapter, whenever you run any JavaScript code, ask three questions:

```text
1. Where does the code run?
2. Which engine runs it?
3. Which runtime APIs are available?
```

For the local course files the answer is usually:

```text
Where it runs: Node.js
Engine: V8
Available APIs: Node.js APIs
Unavailable APIs: document, window, DOM
```

For code inside a browser page:

```text
Where it runs: browser runtime
Engine: depends on the browser
Available APIs: window, document, DOM
Unavailable APIs: the ordinary Node.js process and fs
```

For TypeScript code:

```text
First: TypeScript checks the types
Then: JavaScript runs
```

This simple distinction will be used in the following chapters. When Execution Context, Scope, modules, async and Playwright appear, the question "where does this code run?" will become one of the main analysis tools.

The Execution Context is the internal execution environment of a particular piece of code; it will be studied in a dedicated chapter.

Scope is the area in which names are available; Scope will be studied later.

Async is working with actions that do not finish immediately; async JavaScript will be covered in a dedicated section.

---

## Use in Automation QA

Automation QA often connects Node.js and the browser.

Playwright tests usually run in Node.js. They use the Playwright API to open the browser, navigate to a page, click an element or check text.

But the page itself lives in the browser runtime.

When you write ordinary test code, it runs in the Node.js context.

When you pass code to `page.evaluate`, that code runs in the browser context.

`page.evaluate` is a Playwright method for running a function inside the browser page; it will be studied in the Playwright section.

Why this matters:

* in the test file you can read Node.js environment variables;
* inside the page you can read the DOM;
* `document` is not available directly in a Node.js test;
* `process` is not available inside an ordinary browser context;
* an error may be related not to Playwright, but to the wrong execution context.

This distinction will be used constantly in Playwright, API testing, fixtures, helpers and framework architecture.

---

## FAQ

### Are JavaScript and ECMAScript the same thing?

Not quite.

ECMAScript is the standard for the language. JavaScript is the practical language that follows this standard and runs in specific runtimes.

### Why is there no document in Node.js?

`document` belongs to the browser API for working with the page. Node.js is not a browser and has no HTML page, so an ordinary Node.js file does not get `document`.

### Why is there no process in the browser?

`process` belongs to the Node.js API. An ordinary browser page should not have direct access to the Node.js process and the system environment.

### If Chrome and Node.js both use V8, why are the APIs different?

Because V8 is the engine, and the APIs are added by the runtime. Chrome and Node.js can use the same engine but provide different environments.

### Do I already need to know all the browser APIs and Node.js APIs?

No.

For now the important thing is to understand that the set of APIs depends on the runtime. Specific APIs will be studied when they are needed in the JavaScript and Automation QA sections.

### Why does TypeScript not replace JavaScript?

TypeScript adds types and checking before running, but after compilation it is JavaScript that runs. So the JavaScript mechanisms remain a required foundation.

---

## Summary

JavaScript is a programming language that appeared for the interactivity of web pages and then came to be used more broadly thanks to browsers, the development of engines, Node.js and a large ecosystem.

ECMAScript is the standard for the core of the language. JavaScript is the practical implementation of the language in engines and runtimes. The engine runs the JavaScript code. The runtime includes the engine and adds environment APIs.

The browser runtime provides `window`, `document`, the DOM and browser APIs. The Node.js runtime provides `process`, file capabilities, modules and APIs for working outside the browser. The same JavaScript language can run in both places, but the available APIs differ.

For Automation QA it is especially important to distinguish the Node.js context from the browser context. A Playwright test runs in Node.js, controls the browser, and the code inside `page.evaluate` already runs in the browser context.

The next chapter will explain how JavaScript runs internally: what happens to the code before it runs, and what parsing, the AST, compilation and execution are. These terms will be introduced gradually and with an internal model.

---

## What to remember

✓ JavaScript is a programming language.

✓ ECMAScript is the standard for the core of JavaScript.

✓ The engine runs JavaScript code.

✓ The runtime includes the engine and additional APIs.

✓ The browser runtime provides `window`, `document` and the DOM.

✓ The Node.js runtime provides `process`, `fs`, `path` and other Node.js APIs.

✓ One engine can be used in different runtimes.

✓ Playwright tests run in Node.js but control the browser.

✓ Code inside `page.evaluate` runs in the browser context.

✓ TypeScript does not replace JavaScript: after compilation it is JavaScript that runs.

---

## Check yourself

1. What is JavaScript?

2. Why does ECMAScript exist?

3. How does ECMAScript differ from JavaScript?

4. What does a JavaScript Engine do?

5. How does an engine differ from a runtime?

6. Which APIs are characteristic of the browser runtime?

7. Which APIs are characteristic of the Node.js runtime?

8. Why is `document` not available in an ordinary Node.js file?

9. Where does the code of a Playwright test run?

10. Where does the code inside `page.evaluate` run?
