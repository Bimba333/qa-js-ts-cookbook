function isTokenExpired(expiresAtIso) {
  const expiresAt = new Date(expiresAtIso).getTime();

  if (Number.isNaN(expiresAt)) {
    throw new Error('Invalid expiration date');
  }

  return Date.now() >= expiresAt;
}

const expiredTokenDate = '2020-01-01T00:00:00.000Z';

console.log(isTokenExpired(expiredTokenDate));
