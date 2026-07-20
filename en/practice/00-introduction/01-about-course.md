# Practice. Chapter 0. About the course

## Comprehension check

Answer in your own words.

1. Why does this course start with JavaScript rather than TypeScript or Playwright?
2. What does the principle "understanding matters more than memorization" mean?
3. Why does TypeScript not replace runtime checks of API responses?
4. How does knowing syntax differ from understanding a mechanism?
5. Why must an Automation QA Engineer understand Stack, Heap, References and the Event Loop?
6. How do the directories `docs/`, `examples/`, `practice/` and `solutions/` relate to each other?
7. Why should you not open the solutions before making your own attempt at the practice?

## Code analysis

Read the code and explain what will happen.

```javascript
const testUser = {
  email: 'qa@example.com'
};

const userFromHelper = testUser;

userFromHelper.email = 'changed@example.com';

console.log(testUser.email);
```

Answer:

1. What will be printed to the console?
2. Why is the change visible through the `testUser` variable?
3. How can this situation affect test data in Automation QA?

## Writing code

Write a small JavaScript snippet that shows the difference between:

* reassigning a variable;
* modifying the object that a variable points to.

Use meaningful variable names. The example should be minimal.

## Bug hunt

Find the flaw in the reasoning.

```text
If an object is described by a TypeScript type, then the API will definitely return an object of that shape.
Therefore runtime checks in API tests are not needed.
```

Explain:

1. Which part of the reasoning is wrong?
2. Why does TypeScript not guarantee the shape of the real JSON at runtime?
3. What checks are worth adding to an API test?

## QA task

Imagine there is a flaky test in the project.

The test sometimes fails after a shared test-data object is modified. Describe:

1. Which JavaScript topic do you need to study to understand the cause?
2. What questions will you ask while analyzing the problem?
3. How can you reduce the risk of such an error in the test framework?

## Mini-project

Draft a personal plan for going through the course.

The plan should include:

* how you will read the chapters;
* where you will run the examples;
* how you will do the practice;
* when you will look at the solutions;
* how you will record gaps in your understanding;
* how you will connect the course topics to your current or future work in Automation QA.

The format is free, but the plan should be concrete and usable in practice.
