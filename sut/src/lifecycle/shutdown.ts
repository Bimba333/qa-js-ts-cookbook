import { logEvent, safeErrorCode } from "../logging/logger.js";

export type CloseOperation = () => Promise<void>;

export function installShutdownHandlers(
  close: CloseOperation,
  timeoutMs = 3_000,
): () => void {
  let shutdown: Promise<void> | undefined;

  const handleSignal = (signal: NodeJS.Signals): void => {
    shutdown ??= Promise.race([
      close(),
      new Promise<never>((_, reject) => {
        setTimeout(
          () => reject(new Error("SUT shutdown timeout")),
          timeoutMs,
        ).unref();
      }),
    ])
      .then(() => {
        logEvent("shutdown.completed", { signal });
      })
      .catch((error: unknown) => {
        logEvent("shutdown.failed", {
          signal,
          errorCode: safeErrorCode(error),
        });
        process.exitCode = 1;
      });
  };

  process.on("SIGINT", handleSignal);
  process.on("SIGTERM", handleSignal);

  return () => {
    process.off("SIGINT", handleSignal);
    process.off("SIGTERM", handleSignal);
  };
}
