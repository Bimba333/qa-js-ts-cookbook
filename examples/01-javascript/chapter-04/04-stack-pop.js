function outer() {
  console.log('outer before inner');
  inner();
  console.log('outer after inner');
}

function inner() {
  console.log('inner runs and then pops');
}

outer();
