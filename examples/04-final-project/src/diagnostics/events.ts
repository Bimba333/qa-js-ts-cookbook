import { redactFields, type FieldValue } from "./redact.js";

export type LogLevel = "debug" | "info" | "warn" | "error";

export type DiagnosticEvent = Readonly<{
  level: LogLevel;
  event: string;
  correlationId: string;
  occurredAt: string;
  fields: Readonly<Record<string, FieldValue>>;
}>;

export type EventSink = (event: DiagnosticEvent) => void;

/**
 * Средство журналирования сценария.
 *
 * Оно записывает события и не принимает решений: не глотает ошибки, не меняет
 * итог теста и не решает, что считать успехом.
 */
export class ScenarioLog {
  readonly #correlationId: string;
  readonly #sink: EventSink;
  readonly #now: () => Date;
  readonly #events: DiagnosticEvent[] = [];

  constructor(options: {
    correlationId: string;
    sink?: EventSink;
    now?: () => Date;
  }) {
    this.#correlationId = options.correlationId;
    this.#sink = options.sink ?? (() => {});
    this.#now = options.now ?? (() => new Date());
  }

  get correlationId(): string {
    return this.#correlationId;
  }

  get events(): readonly DiagnosticEvent[] {
    return Object.freeze([...this.#events]);
  }

  write(
    level: LogLevel,
    event: string,
    fields: Readonly<Record<string, FieldValue>> = {},
  ): DiagnosticEvent {
    const record: DiagnosticEvent = Object.freeze({
      level,
      event,
      correlationId: this.#correlationId,
      occurredAt: this.#now().toISOString(),
      fields: redactFields(fields),
    });

    this.#events.push(record);
    this.#sink(record);

    return record;
  }

  step(event: string, fields?: Readonly<Record<string, FieldValue>>): DiagnosticEvent {
    return this.write("info", event, fields);
  }

  failure(event: string, fields?: Readonly<Record<string, FieldValue>>): DiagnosticEvent {
    return this.write("error", event, fields);
  }
}
