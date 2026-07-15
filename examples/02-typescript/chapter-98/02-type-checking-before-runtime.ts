function getStatusText(status: string) {
  return status.toUpperCase();
}

// INTENTIONAL TYPESCRIPT DIAGNOSTIC EXAMPLE
// Ожидаемая идея диагностики: number нельзя передать в параметр string.
// @ts-expect-error: status должен быть строкой.
getStatusText(200);

console.log(getStatusText('passed'));
