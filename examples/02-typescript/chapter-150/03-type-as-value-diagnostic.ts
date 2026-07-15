export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
interface TestMeta {
  title: string;
}

const meta: TestMeta = {
  title: "login",
};

// @ts-expect-error TestMeta является типом, а не значением времени выполнения.
console.log(TestMeta);

console.log(meta.title);
