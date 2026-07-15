// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE

type TestCase = {
  id: string;
  title: string;
};

const directTestCase: TestCase = {
  id: 'T-1',
  title: 'login',
  // @ts-expect-error fresh object literal has an extra property.
  priority: 'high',
};

const source = {
  id: 'T-2',
  title: 'checkout',
  priority: 'high',
};

const assignedTestCase: TestCase = source;

console.log(directTestCase, assignedTestCase);
