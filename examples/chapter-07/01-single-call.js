function greet() {
  console.log('greet context is running');
}

console.log('global context before call');
greet();
console.log('global context after call');
