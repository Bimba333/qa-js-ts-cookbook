export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
// @ts-expect-error Type aliases с одинаковым именем не объединяются.
type UserId = string;

// @ts-expect-error Type aliases с одинаковым именем не объединяются.
type UserId = number;

const userId: UserId = "user-1";

console.log(userId);
