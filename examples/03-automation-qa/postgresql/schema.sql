CREATE TABLE owners (
  id text PRIMARY KEY,
  name text NOT NULL
);

CREATE TABLE tasks (
  id text PRIMARY KEY,
  title text NOT NULL UNIQUE,
  completed boolean NOT NULL DEFAULT false,
  priority text NOT NULL CHECK (priority IN ('low', 'high')),
  description text NULL,
  owner_id text NULL REFERENCES owners(id),
  estimated_hours numeric(10, 2) NULL,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);

