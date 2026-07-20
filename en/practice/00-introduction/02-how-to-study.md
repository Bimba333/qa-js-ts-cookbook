# Practice. Chapter 1. How to use the course

## Comprehension check

Answer in your own words.

1. Why does reading a chapter without running the examples give a weak result?
2. Why does the order of chapters matter for understanding the following topics?
3. What do you need to do before running a code example?
4. Why should solutions be read after your own attempt?
5. What is `playground/` used for?
6. How does a personal note differ from a copy of the chapter text?
7. How do you correctly return to a difficult topic?
8. Why must an Automation QA Engineer connect every topic to test code?

## Code analysis

Read the code and predict the result before running it.

```javascript
let retryCount = 0;

function increaseRetryCount() {
  retryCount = retryCount + 1;
}

increaseRetryCount();

console.log(retryCount);
```

Answer:

1. What will be printed to the console?
2. Which line changed the value?
3. What small experiment could you run with this example?

## Writing code

Write a minimal example that can be used for a learning experiment.

Requirements:

* the example should test one idea;
* the variable names should be meaningful;
* before the code, write down the expected result;
* after the code, write down how you will verify the result in `playground/`.

## Bug hunt

Find the flaw in the approach.

```text
I will read the whole chapter, then open the solutions right away.
If the solution is clear, the topic can be considered learned.
```

Explain:

1. Which part of the approach is wrong?
2. Why does a feeling of clarity not equal understanding?
3. How should the learning process be changed?

## QA tasks

### Task 1

You are studying the topic of functions.

Write down three possible uses of functions in Automation QA:

* for UI tests;
* for API tests;
* for preparing test data.

### Task 2

Imagine a test became flaky after a helper function was changed.

Describe the learning analysis cycle:

1. What expectation did the test have?
2. What actual result appeared?
3. Which hypothesis can you test in `playground/`?
4. How do you record the conclusion in your personal notes?

## Mini-project

Create a personal note template for going through the course chapters.

The template should include:

* the chapter title;
* the main idea;
* the mechanism;
* a minimal example;
* the run result;
* a common mistake;
* the QA use;
* a question for review.

The template should be usable after every chapter.
