# Practice. Chapter 3. The working environment

## Comprehension check

Answer in your own words.

1. Why should the working environment be prepared before studying JavaScript?
2. Why is Node.js needed in the course?
3. What is npm at a basic level?
4. Why is VS Code convenient for this course?
5. What is `playground/` used for?
6. Why is it important to know the current folder in the terminal?
7. How does an environment error differ from an error in the code?
8. Why should you not open the solutions before your own attempt?

## Code reading

Read the code.

```javascript
console.log('Environment is ready');
```

Answer:

1. What does this file do at the level of the result?
2. Which command can run it if the file is saved as `playground/environment-check.js`?
3. What should you check if the file does not run?

## Predict the result before running

Create a file:

```text
playground/predict-output.js
```

Add the code:

```javascript
console.log('First run');
console.log('Second run');
```

Before running, write down the output you expect to see in the terminal.

Then run the file and compare your expectation with the actual result.

## Writing a small piece of code

Create a file:

```text
playground/qa-message.js
```

Add one line of code that prints to the terminal:

```text
QA environment is ready
```

Run the file with Node.js.

## Debugging task

Imagine you ran the command:

```bash
node playground/missing-file.js
```

and got the error:

```text
Cannot find module
```

Answer:

1. What does this error mean?
2. Which three checks should you do first?
3. Why should you not change the JavaScript code right away?

## QA tasks

### Task 1

Describe why an Automation QA Engineer should record the command used to run the tests.

### Task 2

Put together a short checklist for verifying the environment before running the learning examples.

The checklist should include:

* checking Node.js;
* checking npm;
* checking the current folder;
* checking the file name;
* running a minimal file.

## Mini-project

Create a personal environment-check file in `playground/`.

Requirements:

* the file should have the `.js` extension;
* the file should print one line to the terminal;
* before running, write down the expected result;
* after running, write down the actual result;
* if an error occurred, describe the hypothesis and the check.

The note format is free. The main thing is to show the line of diagnosis.
