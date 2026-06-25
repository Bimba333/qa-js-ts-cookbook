function safeRecursiveDemo(depth) {
  console.log('depth:', depth);

  if (depth === 3) {
    console.log('Stop before stack overflow');
    return;
  }

  safeRecursiveDemo(depth + 1);
}

safeRecursiveDemo(1);
