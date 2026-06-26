function collectStatuses(...statusCodes) {
  console.log(statusCodes);
}

collectStatuses();
collectStatuses(200);
collectStatuses(200, 201, 204);
