-- Наблюдаемый audit trail.
--
-- Cleanup, authentication и отказы в доступе оставляют запись, которую тест
-- может прочитать через verification role. Это даёт главам про диагностику
-- источник фактов, не зависящий от логов процесса.

CREATE TABLE audit_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event text NOT NULL
    CHECK (event ~ '^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$'),
  correlation_id text
    CHECK (
      correlation_id IS NULL
      OR correlation_id ~ '^[A-Za-z0-9._:-]{1,160}$'
    ),
  test_run_id uuid REFERENCES test_runs(id),
  principal_id uuid REFERENCES users(id),
  detail jsonb NOT NULL DEFAULT '{}'::jsonb
    CHECK (jsonb_typeof(detail) = 'object'),
  occurred_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX audit_events_test_run_id_idx
  ON audit_events(test_run_id);
CREATE INDEX audit_events_event_idx
  ON audit_events(event);
CREATE INDEX audit_events_occurred_at_idx
  ON audit_events(occurred_at);
