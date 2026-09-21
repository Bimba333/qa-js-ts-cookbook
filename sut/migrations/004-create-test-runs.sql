-- Test run ownership boundary.
--
-- Каждый выданный bearer token и каждая UI session принадлежат одному test run.
-- Работа параллельных тестов изолируется именно по этому идентификатору, а
-- cleanup удаляет строго свой run и никогда не трогает seed-данные.

CREATE TABLE test_runs (
  id uuid PRIMARY KEY,
  principal_id uuid NOT NULL REFERENCES users(id),
  source text NOT NULL
    CHECK (source IN ('rest', 'ui')),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX test_runs_principal_id_idx
  ON test_runs(principal_id);
CREATE INDEX test_runs_created_at_idx
  ON test_runs(created_at);

-- Work item может ссылаться только на существующий run. Seed-строки продолжают
-- держать NULL в обеих колонках пары test_run_id/creator_test_id.
ALTER TABLE work_items
  ADD CONSTRAINT work_items_test_run_id_fkey
  FOREIGN KEY (test_run_id) REFERENCES test_runs(id);
