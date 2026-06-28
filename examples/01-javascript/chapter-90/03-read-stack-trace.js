function parseReport(report) {
  if (!report.summary) {
    throw new Error('Report summary is missing');
  }

  return report.summary.status;
}

function createMessage(report) {
  const status = parseReport(report);

  return `report status: ${status}`;
}

const report = {};

try {
  console.log(createMessage(report));
} catch (error) {
  console.log(error.message);
  console.log(error.stack.split('\n')[1].trim());
}
