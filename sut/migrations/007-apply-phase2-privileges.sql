-- Privileges для Phase 2.
--
-- Column-level модель из миграции 003 сохраняется: application role получает
-- ровно те колонки, которые нужны транспортам, verification role остаётся
-- read-only. Новые права выдаются явно, без GRANT ALL.

REVOKE ALL ON TABLE test_runs FROM PUBLIC;
REVOKE ALL ON TABLE auth_tokens FROM PUBLIC;
REVOKE ALL ON TABLE ui_sessions FROM PUBLIC;
REVOKE ALL ON TABLE audit_events FROM PUBLIC;

-- Application role должна проверять credential material при логине.
-- Phase 1 сознательно не выдавала эти колонки, потому что процесс был
-- health-only и не выполнял authentication.
GRANT SELECT (
  password_salt,
  password_hash
) ON users TO sut_app;

-- Признак seed нужен, чтобы вернуть предсказуемый 403 до попытки записи,
-- а не ловить исключение защитного триггера как внутреннюю ошибку.
GRANT SELECT (is_seed) ON work_items TO sut_app;
GRANT SELECT (is_seed) ON users TO sut_app;

GRANT SELECT (
  id,
  principal_id,
  source,
  created_at
) ON test_runs TO sut_app;
GRANT INSERT (
  id,
  principal_id,
  source
) ON test_runs TO sut_app;

GRANT SELECT (
  token_hash,
  user_id,
  test_run_id,
  issued_at,
  expires_at
) ON auth_tokens TO sut_app;
GRANT INSERT (
  token_hash,
  user_id,
  test_run_id,
  expires_at
) ON auth_tokens TO sut_app;
GRANT DELETE ON TABLE auth_tokens TO sut_app;

GRANT SELECT (
  session_hash,
  user_id,
  test_run_id,
  csrf_token,
  created_at,
  expires_at
) ON ui_sessions TO sut_app;
GRANT INSERT (
  session_hash,
  user_id,
  test_run_id,
  csrf_token,
  expires_at
) ON ui_sessions TO sut_app;
GRANT DELETE ON TABLE ui_sessions TO sut_app;

GRANT INSERT (
  event,
  correlation_id,
  test_run_id,
  principal_id,
  detail
) ON audit_events TO sut_app;
GRANT SELECT (
  id,
  event,
  correlation_id,
  test_run_id,
  principal_id,
  detail,
  occurred_at
) ON audit_events TO sut_app;
GRANT USAGE ON SEQUENCE audit_events_id_seq TO sut_app;

-- Verification role читает всё, что нужно тестам для проверки состояния.
GRANT SELECT ON TABLE test_runs TO sut_reader;
GRANT SELECT ON TABLE audit_events TO sut_reader;
GRANT SELECT (
  user_id,
  test_run_id,
  issued_at,
  expires_at
) ON auth_tokens TO sut_reader;
GRANT SELECT (
  user_id,
  test_run_id,
  created_at,
  expires_at
) ON ui_sessions TO sut_reader;
