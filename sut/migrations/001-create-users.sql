CREATE TABLE users (
  id uuid PRIMARY KEY,
  login text NOT NULL UNIQUE
    CHECK (length(btrim(login)) BETWEEN 1 AND 80),
  password_salt text NOT NULL
    CHECK (length(password_salt) BETWEEN 16 AND 160),
  password_hash text NOT NULL
    CHECK (length(password_hash) BETWEEN 32 AND 255),
  role text NOT NULL
    CHECK (role IN ('tester', 'viewer')),
  is_active boolean NOT NULL DEFAULT true,
  is_seed boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP
);
