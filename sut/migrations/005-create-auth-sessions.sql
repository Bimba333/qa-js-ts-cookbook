-- Authentication state для двух транспортов.
--
-- REST использует opaque bearer token, UI — cookie-session с CSRF-токеном.
-- В базе хранится только SHA-256 от секрета: утечка дампа не даёт возможности
-- аутентифицироваться, а сравнение остаётся точным.

CREATE TABLE auth_tokens (
  token_hash text PRIMARY KEY
    CHECK (token_hash ~ '^[0-9a-f]{64}$'),
  user_id uuid NOT NULL REFERENCES users(id),
  test_run_id uuid NOT NULL REFERENCES test_runs(id),
  issued_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at timestamptz NOT NULL,
  CONSTRAINT auth_tokens_expiry_after_issue
    CHECK (expires_at > issued_at)
);

CREATE INDEX auth_tokens_user_id_idx
  ON auth_tokens(user_id);
CREATE INDEX auth_tokens_expires_at_idx
  ON auth_tokens(expires_at);

CREATE TABLE ui_sessions (
  session_hash text PRIMARY KEY
    CHECK (session_hash ~ '^[0-9a-f]{64}$'),
  user_id uuid NOT NULL REFERENCES users(id),
  test_run_id uuid NOT NULL REFERENCES test_runs(id),
  csrf_token text NOT NULL
    CHECK (csrf_token ~ '^[A-Za-z0-9_-]{32,128}$'),
  created_at timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at timestamptz NOT NULL,
  CONSTRAINT ui_sessions_expiry_after_creation
    CHECK (expires_at > created_at)
);

CREATE INDEX ui_sessions_user_id_idx
  ON ui_sessions(user_id);
CREATE INDEX ui_sessions_expires_at_idx
  ON ui_sessions(expires_at);
