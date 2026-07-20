# Solutions. Chapter 3. The working environment

## Comprehension check

### 1. Why the environment should be prepared in advance

If the environment is not ready, run errors will get in the way of studying JavaScript. The reader will spend attention on problems with commands, paths and files instead of the chapter topic.

A ready environment reduces noise: the file is created in the right folder, the command runs predictably, the result is visible in the terminal.

### 2. Why Node.js is needed

Node.js is needed to run JavaScript files outside the browser.

Within this chapter it is enough to understand Node.js as a tool that runs a `.js` file with a command:

```bash
node file.js
```

### 3. What npm is

npm is a tool for working with JavaScript packages.

In this chapter npm is only needed at a basic level: to check that it is installed and available with the command:

```bash
npm -v
```

### 4. Why VS Code is convenient

VS Code combines a file editor, a built-in terminal, code highlighting, extensions and convenient project navigation.

For the course this matters, because the reader constantly switches between `docs/`, `practice/`, `solutions/` and `playground/`.

### 5. What `playground/` is used for

`playground/` is used for experiments:

* create a temporary file;
* run a minimal example;
* test a hypothesis;
* read an error;
* change one detail and run again.

### 6. Why the current folder matters

Terminal commands run relative to the current folder.

If the file is at `playground/hello.js`, the command from the project root will be:

```bash
node playground/hello.js
```

If the terminal is already open inside `playground/`, the command will be:

```bash
node hello.js
```

### 7. How an environment error differs from a code error

An environment error is related to tools, paths, installation or the current folder.

A code error arises when the file is found and run, but its contents cannot be executed correctly.

An example of an environment error:

```text
Cannot find module
```

if the file is specified incorrectly or does not exist.

### 8. Why solutions are opened after an attempt

Your own attempt tests your thinking. A solution is for comparing reasoning.

If you open the solution right away, diagnosis is not trained: the reader learns the answer but does not check whether they could have found the cause themselves.

## Code reading

The code:

```javascript
console.log('Environment is ready');
```

At the level of the result, the file prints the line:

```text
Environment is ready
```

If the file is saved as `playground/environment-check.js`, the run from the project root is:

```bash
node playground/environment-check.js
```

If the file does not run, you should first check:

* whether the file exists;
* whether the name is spelled correctly;
* whether it has the `.js` extension;
* which folder the command was run from;
* whether Node.js is installed.

## Predict the result before running

The code:

```javascript
console.log('First run');
console.log('Second run');
```

Expected output:

```text
First run
Second run
```

Explanation:

The file has two output lines. Node.js runs the file top to bottom, so `First run` appears first, then `Second run`.

The deep rules of JavaScript execution will be studied later. Here it is enough to see the order of the output.

## Writing a small piece of code

File:

```text
playground/qa-message.js
```

Code:

```javascript
console.log('QA environment is ready');
```

Run from the project root:

```bash
node playground/qa-message.js
```

Expected output:

```text
QA environment is ready
```

Explanation:

The file contains one line that prints text to the terminal. If the output matched, Node.js is available, the path is correct and the file was created correctly.

## Debugging task

The command:

```bash
node playground/missing-file.js
```

The error:

```text
Cannot find module
```

This error means that Node.js could not find the file at the given path.

The first checks:

1. Check whether the file `playground/missing-file.js` exists.
2. Check whether the file name is spelled correctly.
3. Check which folder the command was run from.

You should not change the JavaScript code right away, because the problem may not be in the file contents. If the file was not found, Node.js did not even reach running the code.

## QA tasks

### Task 1

An Automation QA Engineer should record the command used to run the tests, because the result depends on the run context.

The command may determine:

* which tests run;
* which environment is used;
* which variables are passed;
* which reporter is enabled;
* whether it is a local run or CI.

Without the command it is hard to reproduce an error.

### Task 2

An example checklist:

```text
1. Run node -v.
2. Run npm -v.
3. Run pwd and check the current folder.
4. Check that the file is in playground/.
5. Check the .js extension.
6. Run node playground/hello.js.
7. If there is an error, read the error type and the file path.
```

Explanation:

The checklist goes from the environment to the file and only then to the code. This reduces the risk of accidentally changing correct code when there is a path or installation error.

## Mini-project

One possible version.

File:

```text
playground/my-environment-check.js
```

Code:

```javascript
console.log('My environment is ready');
```

Expected result:

```text
My environment is ready
```

Command:

```bash
node playground/my-environment-check.js
```

The actual result should match the expected one.

If a `Cannot find module` error occurred, a possible hypothesis:

```text
The file was created outside playground/ or the name is wrong.
```

Check:

```bash
ls playground
```

Explanation:

The mini-project tests the full cycle: create a file, predict the result, run it, read the output, and on an error state a hypothesis and check it.

## Common mistakes

### Mistake 1. Checking the code before checking the path

If the error says the file was not found, you should first check the path and the file name.

### Mistake 2. Not writing down the expected result

Without an expected result, running becomes observation. A prediction makes running a test of understanding.

### Mistake 3. Ignoring the current folder

The same command may work or not work depending on which folder it is run from.

## Possible improvements

After completing the practice you can:

* keep an environment-check file in `playground/`;
* add the commands `node -v`, `npm -v`, `pwd`, `ls` to your personal notes;
* write down common run errors and ways to check them;
* run it again after restarting the terminal.
