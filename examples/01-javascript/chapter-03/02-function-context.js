function printMessage() {
  console.log('Function context: running printMessage');
}

console.log('Global context: before function call');
printMessage();
console.log('Global context: after function call');
