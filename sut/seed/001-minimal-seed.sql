INSERT INTO users (
  id,
  login,
  password_salt,
  password_hash,
  role,
  is_active,
  is_seed,
  created_at
)
VALUES
  (
    '10000000-0000-4000-8000-000000000001',
    'educational_tester',
    'phase1-tester-salt',
    'phase1-placeholder-hash-tester-00000000000000000000000000000001',
    'tester',
    true,
    true,
    '2026-01-01T00:00:00Z'
  ),
  (
    '10000000-0000-4000-8000-000000000002',
    'educational_viewer',
    'phase1-viewer-salt',
    'phase1-placeholder-hash-viewer-00000000000000000000000000000002',
    'viewer',
    true,
    true,
    '2026-01-01T00:00:00Z'
  )
ON CONFLICT (id) DO UPDATE
SET
  login = EXCLUDED.login,
  password_salt = EXCLUDED.password_salt,
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  is_seed = EXCLUDED.is_seed,
  created_at = EXCLUDED.created_at
WHERE users.is_seed = true;
