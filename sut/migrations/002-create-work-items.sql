CREATE TABLE work_items (
  id uuid PRIMARY KEY,
  title text NOT NULL
    CHECK (length(btrim(title)) BETWEEN 1 AND 120),
  description text NOT NULL
    CHECK (length(btrim(description)) BETWEEN 1 AND 2000),
  status text NOT NULL
    CHECK (status IN ('NEW', 'IN_PROGRESS', 'DONE', 'CANCELLED')),
  priority text NOT NULL
    CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
  owner_id uuid NOT NULL REFERENCES users(id),
  created_by uuid NOT NULL REFERENCES users(id),
  test_run_id uuid,
  creator_test_id text
    CHECK (
      creator_test_id IS NULL
      OR creator_test_id ~ '^[A-Za-z0-9._:-]{1,160}$'
    ),
  is_seed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  CONSTRAINT work_items_test_identity_pair_check
    CHECK (
      (test_run_id IS NULL AND creator_test_id IS NULL)
      OR
      (test_run_id IS NOT NULL AND creator_test_id IS NOT NULL)
    )
);

CREATE INDEX work_items_test_run_id_idx
  ON work_items(test_run_id);
CREATE INDEX work_items_creator_test_id_idx
  ON work_items(creator_test_id);
CREATE INDEX work_items_owner_id_idx
  ON work_items(owner_id);
CREATE INDEX work_items_status_priority_idx
  ON work_items(status, priority);
