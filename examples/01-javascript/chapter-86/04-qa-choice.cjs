const project = {
  name: 'legacy-api-tests',
  moduleSystem: 'CommonJS',
};

if (project.moduleSystem === 'CommonJS') {
  console.log(`${project.name} uses require()`);
} else {
  console.log(`${project.name} uses import/export`);
}
