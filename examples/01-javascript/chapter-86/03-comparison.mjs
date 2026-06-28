const moduleSystems = [
  { name: 'ES Modules', importStyle: 'import / export' },
  { name: 'CommonJS', importStyle: 'require() / module.exports' },
];

for (const system of moduleSystems) {
  console.log(`${system.name}: ${system.importStyle}`);
}
