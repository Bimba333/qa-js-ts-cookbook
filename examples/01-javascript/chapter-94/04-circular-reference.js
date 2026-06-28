const report = {
  title: 'checkout test',
};

report.self = report;

try {
  const jsonText = JSON.stringify(report);
  console.log(jsonText);
} catch (error) {
  console.log(error.name);
  console.log(error.message);
}
