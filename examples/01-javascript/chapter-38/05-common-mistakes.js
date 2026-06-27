const config = {};

Object.defineProperty(config, 'environment', {
  value: 'staging'
});

console.log(Object.keys(config));
console.log(Object.getOwnPropertyDescriptor(config, 'environment'));
