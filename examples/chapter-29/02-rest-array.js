function collectStatuses(...statusCodes) {
  console.log(Array.isArray(statusCodes));
  console.log(statusCodes);
}

collectStatuses(200, 201);
