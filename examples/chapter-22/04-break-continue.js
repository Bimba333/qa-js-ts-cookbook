for (let responseIndex = 0; responseIndex < 5; responseIndex += 1) {
  if (responseIndex === 1) {
    continue;
  }

  if (responseIndex === 4) {
    break;
  }

  console.log('Validate response', responseIndex);
}
