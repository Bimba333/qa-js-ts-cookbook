REVOKE ALL ON TABLE users FROM PUBLIC;
REVOKE ALL ON TABLE work_items FROM PUBLIC;
REVOKE ALL ON TABLE schema_migrations FROM PUBLIC;

GRANT SELECT (
  id,
  login,
  role,
  is_active,
  created_at
) ON users TO sut_app;
GRANT SELECT (
  id,
  title,
  description,
  status,
  priority,
  owner_id,
  created_by,
  test_run_id,
  creator_test_id,
  created_at,
  updated_at,
  version
) ON work_items TO sut_app;
GRANT DELETE ON TABLE work_items TO sut_app;
GRANT INSERT (
  id,
  title,
  description,
  status,
  priority,
  owner_id,
  created_by,
  test_run_id,
  creator_test_id
) ON work_items TO sut_app;
GRANT UPDATE (
  title,
  description,
  status,
  priority,
  updated_at,
  version
) ON work_items TO sut_app;

GRANT SELECT ON TABLE schema_migrations TO sut_reader;
GRANT SELECT (
  id,
  login,
  role,
  is_active,
  is_seed,
  created_at
) ON users TO sut_reader;
GRANT SELECT ON TABLE work_items TO sut_reader;

CREATE FUNCTION protect_seed_work_items()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = pg_catalog
AS $$
BEGIN
  IF OLD.is_seed AND CURRENT_USER <> 'sut_migrator' THEN
    RAISE EXCEPTION 'seed work item is immutable';
  END IF;

  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$;

REVOKE ALL ON FUNCTION protect_seed_work_items() FROM PUBLIC;

CREATE TRIGGER protect_seed_work_items_before_change
BEFORE UPDATE OR DELETE ON work_items
FOR EACH ROW
EXECUTE FUNCTION protect_seed_work_items();
