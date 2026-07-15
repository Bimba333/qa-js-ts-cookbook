export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
interface ResultInfo {
  status: "passed";
}

interface ResultInfo {
  // @ts-expect-error Тип свойства конфликтует с предыдущим объявлением.
  status: "failed";
}

const result: ResultInfo = {
  status: "passed",
};

console.log(result.status);
