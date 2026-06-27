const helper = {
  name: 'status helper'
};

Object.defineProperty(helper, 'internalId', {
  value: 'helper-001',
  enumerable: false
});

console.log(Object.keys(helper));
console.log(helper.internalId);
