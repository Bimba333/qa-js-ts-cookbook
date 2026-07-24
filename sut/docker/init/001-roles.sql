\set ON_ERROR_STOP on

CREATE ROLE sut_migrator
  LOGIN
  PASSWORD 'educational_migrator_only'
  NOSUPERUSER
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION;

CREATE ROLE sut_app
  LOGIN
  PASSWORD 'educational_app_only'
  NOSUPERUSER
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION;

CREATE ROLE sut_reader
  LOGIN
  PASSWORD 'educational_reader_only'
  NOSUPERUSER
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION;

CREATE ROLE sut_cleanup
  NOLOGIN
  NOSUPERUSER
  NOCREATEDB
  NOCREATEROLE
  NOREPLICATION;

ALTER DATABASE educational_work_items OWNER TO sut_migrator;
ALTER SCHEMA public OWNER TO sut_migrator;

REVOKE CREATE ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON DATABASE educational_work_items FROM PUBLIC;

GRANT CONNECT ON DATABASE educational_work_items TO sut_migrator;
GRANT CONNECT ON DATABASE educational_work_items TO sut_app;
GRANT CONNECT ON DATABASE educational_work_items TO sut_reader;
GRANT USAGE ON SCHEMA public TO sut_app;
GRANT USAGE ON SCHEMA public TO sut_reader;
