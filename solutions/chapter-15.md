# Решения. Глава 15. Object Type

## Концептуальные вопросы

### 1. Почему primitive values sometimes become insufficient

Ответ:

Primitive values become insufficient when several values describe one entity and should be managed together.

Рассуждение:

`'Anna'`, `'Smith'`, `30` and `true` are useful separately, but in many programs they belong to one user. Object makes this relationship explicit.

Типичная ошибка:

Keep related values in separate variables and rely on reader's memory.

Automation QA connection:

API responses, test data and expected results usually describe entities, not isolated values.

### 2. Какую проблему решает Object Type

Ответ:

Object Type allows JavaScript to represent grouped information as one value.

Рассуждение:

Instead of many unrelated primitive values, object can express one user, one config, one response, one test result.

Типичная ошибка:

Think object is only syntax convenience.

Automation QA connection:

Objects make expected and actual structures visible in tests.

### 3. Object groups related information

Ответ:

It means several properties belong to one conceptual entity.

Рассуждение:

In `user`, properties like `firstName`, `lastName` and `age` describe the same user.

Типичная ошибка:

Group values that are not conceptually related.

Automation QA connection:

Good test data objects reflect real domain entities: user, order, session, config.

### 4. Что такое property

Ответ:

Property is one named piece of information inside object.

Рассуждение:

It consists of property name and property value.

Типичная ошибка:

Call every property a variable.

Automation QA connection:

Assertions often check object properties from API responses.

### 5. Property name vs property value

Ответ:

Property name is the name used to access information. Property value is the actual value under that name.

Рассуждение:

In `firstName: 'Anna'`, `firstName` is property name, `'Anna'` is property value.

Типичная ошибка:

Compare property names instead of values or use wrong property name.

Automation QA connection:

Wrong property name in test leads to `undefined` and failed checks.

### 6. `user` and `firstName`

Ответ:

`user` is variable identifier. `firstName` is property name inside object.

Рассуждение:

`user` gives access to whole object value. `firstName` names one piece of information inside that object.

Типичная ошибка:

Treat object property names as standalone variables.

Automation QA connection:

In assertions, `response.user.email` is a chain of object property reads, not separate variables.

### 7. Reading existing property

Ответ:

Engine finds property name inside object and returns the corresponding property value.

Рассуждение:

For `user.firstName`, engine reads object `user`, then reads property `firstName`.

Типичная ошибка:

Think reading one property reads or copies the entire object.

Automation QA connection:

Most API checks read specific fields from a response object.

### 8. Reading missing property

Ответ:

At this level, reading missing property returns `undefined`.

Рассуждение:

If object has no property with requested name, there is no value under that property name.

Типичная ошибка:

Assume object is broken or that JavaScript will guess a similar property name.

Automation QA connection:

`undefined` in a test often means a typo or unexpected response structure.

### 9. Updating property

Ответ:

Updating property changes value under an existing property name.

Рассуждение:

`user.age = 31` keeps property name `age`, but property value becomes `31`.

Типичная ошибка:

Confuse property update with identifier reassignment.

Automation QA connection:

Tests often update test data before sending it to API or helpers.

### 10. Adding property

Ответ:

Adding property puts new named information into object.

Рассуждение:

If `role` did not exist, `user.role = 'admin'` expands object shape.

Типичная ошибка:

Add properties in many distant lines and make expected shape hard to see.

Automation QA connection:

Explicit object shapes make test data easier to review.

### 11. Deleting property

Ответ:

At a high level, deleting property removes it from object.

Рассуждение:

After `delete user.temporaryCode`, reading `user.temporaryCode` returns `undefined`.

Типичная ошибка:

Explain deletion through Garbage Collector too early.

Automation QA connection:

Tests may remove temporary fields before comparing sanitized objects.

### 12. Nested object

Ответ:

Nested object is useful when grouped information contains smaller groups.

Рассуждение:

User may contain `profile`, `status`, `settings`. Each group has its own properties.

Типичная ошибка:

Flatten everything into one large object with unclear property names.

Automation QA connection:

API responses often contain nested objects.

### 13. `const` and object properties

Ответ:

`const` prevents reassignment of identifier, but object properties can still be updated.

Рассуждение:

`const user = {}` protects `user` as identifier. It does not freeze object shape. References explain the internal reason later.

Типичная ошибка:

Think `const` makes object immutable.

Automation QA connection:

Playwright and test code often use `const` for objects whose properties may still be prepared or adjusted.

### 14. Arrays and functions

Ответ:

Arrays and functions are object values, but they have special behavior and need dedicated chapters.

Рассуждение:

This chapter focuses on plain object as grouped information.

Типичная ошибка:

Mix objects, arrays and functions before understanding properties.

Automation QA connection:

Tests use arrays for lists and functions for helpers, but object shape is the base for reading structured data.

## Identify properties

### Задача 1

Ответ:

Object name: `user`.

Properties:

```text
firstName → "Anna"
lastName  → "Smith"
age       → 30
```

Grouped information:

```text
Basic information about one user.
```

Рассуждение:

All properties describe the same user entity.

Типичная ошибка:

Call `firstName`, `lastName`, `age` separate variables.

Automation QA connection:

This shape can be used as expected user profile.

### Задача 2

Ответ:

Object name: `config`.

Properties:

```text
baseUrl  → "https://example.com"
retries  → 2
headless → true
```

Grouped information:

```text
Runtime or test execution configuration.
```

Рассуждение:

These values belong to one configuration object.

Типичная ошибка:

Spread configuration across unrelated variables.

Automation QA connection:

Test frameworks commonly use configuration objects.

### Задача 3

Ответ:

Object name: `response`.

Properties:

```text
statusCode → 200
body       → object
```

Nested `body` properties:

```text
id    → 101
email → "anna@example.com"
```

Grouped information:

```text
Response metadata and response body.
```

Рассуждение:

`body` is nested grouped information inside response.

Типичная ошибка:

Miss nested structure and try to read `response.email`.

Automation QA connection:

API tests often distinguish response status and response body.

## Read object values

Ответ:

Output:

```text
Anna
Smith
admin
true
```

Рассуждение:

`user.profile.firstName` reads `user`, then `profile`, then `firstName`. The other lines follow the same nested property reading model.

Типичная ошибка:

Try to read `user.firstName`, although `firstName` is inside `profile`.

Automation QA connection:

Nested API response assertions require correct property path.

## Predict the output before running

### Задача 1

Ответ:

```text
Anna
31
admin
```

Рассуждение:

`age` is updated from `30` to `31`. `role` is added as new property.

Типичная ошибка:

Think `const user` prevents `user.age = 31`.

Automation QA connection:

Test data objects may be updated before assertion or request.

### Задача 2

Ответ:

```text
Anna
undefined
```

Рассуждение:

`temporaryCode` is removed from object. Reading a missing property returns `undefined` at this level.

Типичная ошибка:

Expect deleted property to keep old value.

Automation QA connection:

After sanitizing response objects, removed fields should not be used in assertions.

### Задача 3

Ответ:

```text
Anna
undefined
```

Рассуждение:

Object has property `firstName`, not `firstname`. Property names are case-sensitive.

Типичная ошибка:

Miss case difference in property names.

Automation QA connection:

API field names are exact. `userId`, `userid` and `userID` are different names.

## Code reading

Ответ:

1. `expectedUser` represents one expected user entity.
2. Identity properties: `id`, `profile.firstName`, `profile.lastName`.
3. State properties: `status.role`, `status.isActive`, `status.deletedAt`.
4. Nested objects: `profile` and `status`.
5. Primitive values: `101`, `'Anna'`, `'Smith'`, `'admin'`, `true`, `null`.

Рассуждение:

The object groups expected user data and separates profile information from status information.

Типичная ошибка:

Treat nested structure as flat and expect `expectedUser.firstName`.

Automation QA connection:

Expected response objects often have nested domain groups.

## Small coding tasks

### Задача 1

Ответ:

```javascript
const user = {
  firstName: 'Anna',
  lastName: 'Smith',
  age: 30,
  isActive: true,
};

console.log(user);
```

Рассуждение:

All values describe one user, so object is the natural grouping.

Типичная ошибка:

Create four separate variables.

Automation QA connection:

This can become expected profile data in a UI or API test.

### Задача 2

Ответ:

```javascript
const config = {
  baseUrl: 'https://example.com',
  retries: 2,
  headless: true,
};

console.log(config.baseUrl);
console.log(config.retries);
console.log(config.headless);
```

Рассуждение:

Each property is read by object name plus property name.

Типичная ошибка:

Try to read `baseUrl` without `config`.

Automation QA connection:

Configuration objects are common in test runners.

### Задача 3

Ответ:

```javascript
const order = {
  id: 5001,
  status: 'created',
  total: 1200,
};

order.status = 'paid';

console.log(order);
```

Рассуждение:

`status` remains same property name, but property value changes.

Типичная ошибка:

Create `newStatus` instead of updating object when the entity state changes.

Automation QA connection:

Tests often model order lifecycle through status changes.

### Задача 4

Ответ:

```javascript
const testResult = {
  name: 'login test',
  status: 'passed',
};

testResult.durationMs = 350;

console.log(testResult);
```

Рассуждение:

`durationMs` is additional information about the same test result.

Типичная ошибка:

Add unrelated information to object.

Automation QA connection:

Reports often use objects with test name, status and duration.

## Debugging tasks

### Задача 1

Ответ:

The code uses `firstname`, but object has `firstName`.

Correct version:

```javascript
const user = {
  firstName: 'Anna',
};

console.log(user.firstName);
```

Рассуждение:

Property names are exact and case-sensitive.

Типичная ошибка:

Assume JavaScript will match similar names.

Automation QA connection:

Field name typos are common in API and fixture debugging.

### Задача 2

Ответ:

Assertion fails because actual object has `userRole`, not `role`.

Рассуждение:

Reading `actualUser.role` returns `undefined`.

Типичная ошибка:

Look only at value `'admin'` and ignore property name mismatch.

Automation QA connection:

Expected and actual object structures must match, not only values.

### Задача 3

Ответ:

Output is:

```text
undefined
```

Рассуждение:

`temporaryToken` was removed by `delete`. After that, object no longer has this property.

Типичная ошибка:

Use a property after removing it.

Automation QA connection:

Sanitized request or response objects should be checked after field removal.

### Задача 4

Ответ:

The shape is hard to read because object starts empty and properties are added later.

Clearer variant:

```javascript
const user = {
  firstName: 'Anna',
  lastName: 'Smith',
  age: 30,
  isActive: true,
};
```

Рассуждение:

Reader sees full grouped information immediately.

Типичная ошибка:

Build expected data gradually without reason.

Automation QA connection:

Expected objects in tests should be easy to inspect during review.

## QA-oriented tasks

### Сценарий 1. API response

Ответ:

```javascript
const expectedUser = {
  id: 101,
  email: 'anna@example.com',
  role: 'admin',
  active: true,
};
```

Рассуждение:

Property names match API response fields, and values match expected primitives.

Типичная ошибка:

Rename `active` to `isActive` in expected object when API actually returns `active`.

Automation QA connection:

API contract checks require exact field names.

### Сценарий 2. Expected vs actual structure

Ответ:

Mismatch:

```text
expectedUser.role
actualUser.userRole
```

Рассуждение:

Both objects contain value `'admin'`, but under different property names.

Типичная ошибка:

Compare only visible values and ignore object shape.

Automation QA connection:

Structural mismatch often means API contract changed or expected data is outdated.

### Сценарий 3. Configuration object

Ответ:

```javascript
const browserConfig = {
  baseUrl: 'https://example.com',
  headless: true,
  viewportWidth: 1280,
  viewportHeight: 720,
};
```

Рассуждение:

These settings belong to one browser configuration and should be passed or read together.

Типичная ошибка:

Keep related configuration values as separate variables across a file.

Automation QA connection:

Framework configuration is easier to maintain when related settings are grouped.

### Сценарий 4. User profile object

Ответ:

```javascript
const expectedProfile = {
  firstName: 'Anna',
  lastName: 'Smith',
  role: 'Admin',
  isActive: true,
};
```

Рассуждение:

Property names describe UI fields in code-friendly form. `isActive` represents "Active: Yes" as Boolean.

Типичная ошибка:

Store everything as strings exactly as UI text and lose semantic meaning.

Automation QA connection:

Expected profile object can be compared with parsed UI values.

## Mini-project

Возможное решение:

```javascript
const userProfile = {
  identity: {
    id: 101,
    firstName: 'Anna',
    lastName: 'Smith',
    email: 'anna@example.com',
  },
  status: {
    role: 'admin',
    isActive: true,
    deletedAt: null,
  },
  settings: {
    theme: 'dark',
    emailNotifications: true,
  },
};

console.log(userProfile);
console.log(userProfile.identity.firstName);
console.log(userProfile.status.role);
console.log(userProfile.settings.emailNotifications);

userProfile.status.isActive = false;
userProfile.status.lastLoginAt = '2026-06-25';
delete userProfile.settings.theme;

console.log(userProfile);
```

Разбор:

```text
Object name: userProfile

Grouped information:
Identity, status and settings of one user profile.

Nested objects:
identity, status, settings.

Updated properties:
status.isActive.

Added properties:
status.lastLoginAt.

Removed properties:
settings.theme.
```

Рассуждение:

The object is organized by meaning: identity data, status data and settings data are separate nested groups inside one user profile.

Типичная ошибка:

Create one flat object with many unrelated-looking property names.

Automation QA connection:

This shape is close to real API response or expected user fixture in Playwright tests.
