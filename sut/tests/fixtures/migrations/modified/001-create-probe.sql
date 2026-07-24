CREATE TABLE migration_probe (
  id integer PRIMARY KEY,
  changed boolean NOT NULL DEFAULT true
);
