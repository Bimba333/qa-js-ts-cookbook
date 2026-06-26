function collectValues(...values) {
  console.log('Rest collected:', values);
}

const values = [200, 201, 204];

collectValues(...values);
console.log('Spread expanded into call arguments');
