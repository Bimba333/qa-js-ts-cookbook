// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
// Ожидаемая идея диагностики: строка не подходит там, где ожидается number.
// @ts-expect-error: retryCount должен быть числом.
const invalidRetryCount: number = 'three';

const retryCount: number = 3;

console.log(retryCount, invalidRetryCount);
