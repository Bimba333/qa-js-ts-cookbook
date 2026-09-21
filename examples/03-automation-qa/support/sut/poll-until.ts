export const pollUntil = async <Value>(options: {
  read: () => Promise<Value>;
  isReady: (value: Value) => boolean;
  deadlineMs: number;
  intervalMs: number;
  describeLastValue: (value: Value | undefined) => string;
}): Promise<Value> => {
  if (!Number.isFinite(options.deadlineMs) || options.deadlineMs <= 0) {
    throw new RangeError("deadlineMs must be a positive finite number");
  }
  if (!Number.isFinite(options.intervalMs) || options.intervalMs <= 0) {
    throw new RangeError("intervalMs must be a positive finite number");
  }

  const startedAt = performance.now();
  let lastValue: Value | undefined;

  while (true) {
    lastValue = await options.read();
    if (options.isReady(lastValue)) {
      return lastValue;
    }

    const remainingMs = options.deadlineMs - (performance.now() - startedAt);
    if (remainingMs <= 0) {
      break;
    }
    await new Promise<void>((resolve) => {
      setTimeout(resolve, Math.min(options.intervalMs, remainingMs));
    });
  }

  throw new Error(`Polling deadline exceeded. Last value: ${options.describeLastValue(lastValue)}`);
};
