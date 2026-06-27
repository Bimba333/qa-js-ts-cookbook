try {
  console.log('Create temporary user');
  throw new Error('Validation failed');
} catch (error) {
  console.log('Handle validation error');
} finally {
  console.log('Delete temporary user');
}
