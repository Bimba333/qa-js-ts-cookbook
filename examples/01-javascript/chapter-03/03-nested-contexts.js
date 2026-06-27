function outerTask() {
  console.log('outerTask context: start');
  innerTask();
  console.log('outerTask context: finish');
}

function innerTask() {
  console.log('innerTask context: running');
}

outerTask();
