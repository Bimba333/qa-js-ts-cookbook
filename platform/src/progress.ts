export type TaskProgress = Readonly<{
  status: "not-started" | "attempted" | "solved";
  attempts?: number;
  hintsUsed?: number;
  updatedAt?: string;
}>;

export type ProgressMap = Readonly<Record<string, TaskProgress>>;

const STATUSES = new Set(["not-started", "attempted", "solved"]);

export function isProgressMap(value: unknown): value is ProgressMap {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  return Object.values(value as Record<string, unknown>).every((entry) => {
    if (typeof entry !== "object" || entry === null) return false;

    const status = (entry as { status?: unknown }).status;

    return typeof status === "string" && STATUSES.has(status);
  });
}

function rank(status: TaskProgress["status"]): number {
  if (status === "solved") return 2;
  if (status === "attempted") return 1;

  return 0;
}

/**
 * Слияние идёт в пользу большего.
 *
 * Устройство читателя может отправить снимок, сделанный до решения задачи на
 * другом устройстве. Если бы победил «последний записавший», такой снимок
 * откатил бы решённое — поэтому статус и счётчики только растут.
 */
export function mergeProgress(current: ProgressMap, incoming: ProgressMap): ProgressMap {
  const merged: Record<string, TaskProgress> = { ...current };

  for (const [taskId, entry] of Object.entries(incoming)) {
    const previous = merged[taskId];

    if (!previous) {
      merged[taskId] = entry;
      continue;
    }

    merged[taskId] = {
      status: rank(previous.status) >= rank(entry.status) ? previous.status : entry.status,
      attempts: Math.max(previous.attempts ?? 0, entry.attempts ?? 0),
      hintsUsed: Math.max(previous.hintsUsed ?? 0, entry.hintsUsed ?? 0),
      updatedAt: entry.updatedAt ?? previous.updatedAt,
    };
  }

  return merged;
}
