# Решения. Глава 16. References

## Концептуальные вопросы

### 1. Почему references exist

Ответ:

References exist because objects are structured values, and JavaScript needs a way for variables to work with object values without copying the whole object on every assignment.

Рассуждение:

Object can contain many properties. Assignment of object to another variable gives that variable access to the same object.

Типичная ошибка:

Think assignment creates a full independent object copy.

Automation QA connection:

Shared test data often becomes risky because several variables can work with the same object.

### 2. What is reference conceptually

Ответ:

Reference is a conceptual connection from a variable to an object value.

Рассуждение:

Variable does not contain object. It refers to object.

Типичная ошибка:

Treat reference as the object itself.

Automation QA connection:

Understanding references helps debug unexpected changes in request payloads and expected objects.

### 3. Reference vs object

Ответ:

Object is the value with properties. Reference is the way a variable reaches that object.

Рассуждение:

`user` can refer to an object, but object itself is the grouped information with properties.

Типичная ошибка:

Use "reference" and "object" as identical terms.

Automation QA connection:

When a helper receives an object, it receives access to that object, not an isolated independent copy.

### 4. Variable refers to object value

Ответ:

It means the variable gives access to an object value.

Рассуждение:

Reading or updating `user.name` goes through `user` to the object and then to property `name`.

Типичная ошибка:

Imagine that `user` physically contains all object properties.

Automation QA connection:

This model explains why shared fixtures can be modified from different places.

### 5. Multiple variables, one object

Ответ:

When one object reference is assigned to another variable, both variables refer to the same object.

Рассуждение:

`const admin = user` does not create a new object.

Типичная ошибка:

Expect `admin` to be independent from `user`.

Automation QA connection:

Expected and actual objects should not accidentally be aliases for the same object.

### 6. Reading through reference

Ответ:

Engine follows the variable's reference to object, then reads property value.

Рассуждение:

For `admin.name`, first determine which object `admin` refers to, then read property `name`.

Типичная ошибка:

Ignore which object variable currently refers to.

Automation QA connection:

Nested response debugging starts with knowing which object is being read.

### 7. Updating through reference

Ответ:

Engine follows reference to object and changes property value inside that object.

Рассуждение:

If another variable refers to the same object, it observes the updated property.

Типичная ошибка:

Think update belongs only to the variable used in the assignment.

Automation QA connection:

Helper functions can mutate shared payloads.

### 8. Assigning one reference to another variable

Ответ:

The second variable starts referring to the same object as the first.

Рассуждение:

No new object is created by direct assignment.

Типичная ошибка:

Assume assignment copies all properties.

Automation QA connection:

Directly assigning shared test data can make tests affect each other.

### 9. Primitive vs object assignment

Ответ:

Primitive assignment behaves like a copied value at this conceptual level. Object assignment copies the reference, so variables can refer to same object.

Рассуждение:

Changing one primitive variable does not update another. Updating shared object's property is visible through all variables referring to it.

Типичная ошибка:

Apply primitive mental model to objects.

Automation QA connection:

Primitive expected values are usually safer from accidental mutation than object expected data.

### 10. Object identity

Ответ:

Object identity asks whether two variables refer to the same object.

Рассуждение:

Two objects can have same properties but still be different objects.

Типичная ошибка:

Think same-looking objects are identical.

Automation QA connection:

Object equality and structure assertions must be chosen carefully.

### 11. Same-looking objects

Ответ:

They can be different because each object literal creates a separate object value.

Рассуждение:

`{ name: 'Anna' }` and `{ name: 'Anna' }` are two object values with similar structure.

Типичная ошибка:

Expect strict comparison to compare property structure.

Automation QA connection:

Use proper object assertions rather than identity comparison when checking API response structure.

### 12. Why references matter for QA

Ответ:

They explain shared test data mutation, helper side effects and unexpected object changes.

Рассуждение:

Automation frameworks pass objects through helpers, fixtures and assertions. Shared references can make changes visible in unexpected places.

Типичная ошибка:

Debug only the failing assertion and ignore where the object was changed earlier.

Automation QA connection:

Reference mental model is essential for stable Playwright and API tests.

## Predict the output before running

### Задача 1

Ответ:

```text
Anna
Kate
```

Рассуждение:

Primitive assignment gives `adminName` its own primitive value conceptually. Reassigning `adminName` does not change `userName`.

Типичная ошибка:

Expect both variables to change together.

Automation QA connection:

Primitive expected values do not share mutable object state.

### Задача 2

Ответ:

```text
Kate
Kate
```

Рассуждение:

`user` and `admin` refer to the same object. Updating `admin.name` updates the shared object.

Типичная ошибка:

Think `admin` received a copied object.

Automation QA connection:

This is the classic shared test data mutation problem.

### Задача 3

Ответ:

```text
false
```

Рассуждение:

Two object literals create two different object values. Strict comparison checks whether both variables refer to same object.

Типичная ошибка:

Expect object structure comparison.

Automation QA connection:

Use deep structure assertions for API objects, not identity comparison.

### Задача 4

Ответ:

```text
Anna
Kate
```

Рассуждение:

`oldUser` still refers to first object. `currentUser` was reassigned to a new object.

Типичная ошибка:

Think reassignment changes all variables that previously referred to the old object.

Automation QA connection:

Reassigning local variable does not update all aliases in test setup.

## Identify references

### Задача 1

Ответ:

Variables: `user`, `admin`, `currentUser`.

Object values created: 1.

All three variables refer to same object.

Рассуждение:

`admin = user`, then `currentUser = admin`. No new object literal is created after the first one.

Типичная ошибка:

Count three objects because there are three variables.

Automation QA connection:

Several fixture variables can point to same object.

### Задача 2

Ответ:

Variables: `expectedUser`, `actualUser`.

Object values created: 2.

They do not refer to same object.

Рассуждение:

There are two separate object literals.

Типичная ошибка:

Think same property values imply same object.

Automation QA connection:

Expected and actual objects may have same shape but should still be compared by structure, not identity.

### Задача 3

Ответ:

Object values created: 2.

Initially `selectedUser` and `firstSelection` refer to first object. After reassignment, `selectedUser` refers to second object, `firstSelection` still refers to first object.

Рассуждение:

Reassignment changes which object `selectedUser` refers to. It does not move `firstSelection`.

Типичная ошибка:

Think reassignment changes the old object.

Automation QA connection:

Important when test code replaces payload object after saving previous version.

## Code reading

Ответ:

1. Shared object is the object originally assigned to `defaultUser`.
2. Mutation line: `adminUser.role = 'admin';`
3. Output:

```text
admin
```

4. It is dangerous because expected or default test data can be changed accidentally.

Рассуждение:

`adminUser` refers to the same object as `defaultUser`.

Типичная ошибка:

Assume `adminUser` is an independent copy.

Automation QA connection:

Shared default payloads should not be mutated directly across tests.

## Debugging tasks

### Задача 1

Ответ:

Cause: `actualUser` and `expectedUser` refer to the same object.

Correct safer version:

```javascript
const expectedUser = {
  email: 'anna@example.com',
  role: 'user',
};

const actualUser = {
  email: 'anna@example.com',
  role: 'admin',
};

console.log(expectedUser.role);
```

Рассуждение:

`actualUser.role = 'admin'` mutated shared object.

Типичная ошибка:

Debug the assertion instead of object setup.

Automation QA connection:

Expected data must be protected from accidental mutation.

### Задача 2

Ответ:

It returns `false` because `expectedUser` and `actualUser` refer to different objects.

Рассуждение:

Same property values do not mean same object identity.

Типичная ошибка:

Use strict identity comparison for object structure.

Automation QA connection:

API object assertions should compare structure and values through appropriate assertion tools.

### Задача 3

Ответ:

Output:

```text
admin
```

The helper updates property `role` of the object passed to it.

Рассуждение:

The parameter `user` refers to the same object as `testUser` during helper call.

Типичная ошибка:

Assume helper works on a private copy.

Automation QA connection:

Helpers that modify payloads should be named clearly or return new objects.

### Задача 4

Ответ:

Use a new object:

```javascript
const defaultUser = {
  email: 'anna@example.com',
  role: 'user',
};

const adminUser = {
  ...defaultUser,
  role: 'admin',
};
```

Рассуждение:

Object spread creates a new first-level object instead of reusing same object reference.

Типичная ошибка:

Think `const adminUser = defaultUser` creates a copy.

Automation QA connection:

This pattern is common when deriving test data variants.

## QA-oriented tasks

### Сценарий 1. Shared test data

Ответ:

Direct assignment is dangerous because both variables will refer to same object. Updating role for admin scenario also changes default request body.

Рассуждение:

`const adminBody = defaultRequestBody` creates another reference to the same object.

Типичная ошибка:

Modify default test data in one test and wonder why another test fails.

Automation QA connection:

Shared fixtures and default payloads should be treated carefully.

### Сценарий 2. Helper modifies payload

Ответ:

The original object passed to helper will get property `trackingId`.

Рассуждение:

Helper receives a reference to the object and updates it.

Типичная ошибка:

Assume helper only changes a temporary local value.

Automation QA connection:

Request builders can accidentally mutate payloads reused in later assertions.

### Сценарий 3. Expected vs actual

Ответ:

This is unsafe because expected and actual variables refer to same object.

Рассуждение:

Any update to `actualUser` also changes `expectedUser`.

Типичная ошибка:

Make assertion meaningless by comparing an object with itself through another variable.

Automation QA connection:

Expected and actual data should be independently produced unless intentionally testing same identity.

### Сценарий 4. Debug checklist

Ответ:

Checklist:

```text
1. Which variables refer to this object?
2. Was this object assigned directly to another variable?
3. Which helper received this object?
4. Which line updated a property?
5. Was a new object created or only a reference copied?
6. Is expected data shared between tests?
7. Is a fixture returning the same object instance repeatedly?
```

Рассуждение:

Unexpected mutation is usually caused by shared reference and property update.

Типичная ошибка:

Look only at the line where assertion failed.

Automation QA connection:

This checklist is useful for Playwright fixtures, API payload builders and shared config objects.

## Mini-project

Возможное решение:

```javascript
const defaultUser = {
  email: 'anna@example.com',
  role: 'user',
  isActive: true,
};

const sharedAdmin = defaultUser;

sharedAdmin.role = 'admin';

console.log(defaultUser.role);
console.log(sharedAdmin.role);

const safeAdmin = {
  ...defaultUser,
  role: 'admin',
};

console.log(defaultUser.role);
console.log(safeAdmin.role);
```

Разбор:

```text
Variable      | Refers to same object as defaultUser? | Role after update | QA risk
------------- | ------------------------------------- | ----------------- | -------------------------
sharedAdmin   | yes                                   | admin             | mutates default test data
safeAdmin     | no, first-level new object             | admin             | safer for simple objects
```

Рассуждение:

`sharedAdmin` receives the same reference as `defaultUser`. Updating `sharedAdmin.role` updates the shared object. `safeAdmin` is created as a new first-level object using spread.

Типичная ошибка:

Expect `sharedAdmin` to be independent.

Automation QA connection:

This mini-project mirrors real test data preparation: direct assignment is risky, creating a new object is safer for variants.
