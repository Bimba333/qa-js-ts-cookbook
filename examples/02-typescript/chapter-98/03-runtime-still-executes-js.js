function getStatusText(status) {
  return status.toUpperCase();
}

try {
  console.log(getStatusText(200));
} catch (error) {
  console.error(error.message);
}
