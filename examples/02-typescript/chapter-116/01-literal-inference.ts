export {};

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE

const environment = 'staging';
let mutableEnvironment = 'staging';

const exactEnvironment: 'staging' = environment;

// @ts-expect-error let binding is widened to string.
const exactMutableEnvironment: 'staging' = mutableEnvironment;

console.log(exactEnvironment, exactMutableEnvironment);
