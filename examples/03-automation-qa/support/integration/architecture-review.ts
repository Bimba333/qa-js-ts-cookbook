export interface ArchitectureSignal {
  readonly name: string;
  readonly evidence: string;
  readonly severity: "low" | "medium" | "high";
}

export interface ReviewDecision {
  readonly nextAction: string;
  readonly reason: string;
}

export function chooseNextRefactoring(
  signals: readonly ArchitectureSignal[],
): ReviewDecision {
  const ordered = [...signals].sort((left, right) => {
    const weight = { low: 1, medium: 2, high: 3 } as const;
    const severityDifference = weight[right.severity] - weight[left.severity];
    if (severityDifference !== 0) return severityDifference;
    if (left.name < right.name) return -1;
    if (left.name > right.name) return 1;
    return 0;
  });
  const primary = ordered[0];

  if (!primary) {
    return Object.freeze({
      nextAction: "Сохранить текущую архитектуру",
      reason: "Проверенных проблем для рефакторинга нет",
    });
  }

  return Object.freeze({
    nextAction: `Устранить: ${primary.name}`,
    reason: primary.evidence,
  });
}
