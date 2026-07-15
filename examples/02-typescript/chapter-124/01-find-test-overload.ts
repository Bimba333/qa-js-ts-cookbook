export {};

type TestById = {
  source: 'id';
  id: number;
};

type TestByTitle = {
  source: 'title';
  title: string;
};

function findTest(id: number): TestById;
function findTest(title: string): TestByTitle;
function findTest(value: number | string): TestById | TestByTitle {
  if (typeof value === 'number') {
    return { source: 'id', id: value };
  }

  return { source: 'title', title: value };
}

const byId = findTest(101);
const byTitle = findTest('login');

console.log(byId.id);
console.log(byTitle.title);
