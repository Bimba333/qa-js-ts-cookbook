ALTER TABLE migration_probe
  ADD COLUMN label text NOT NULL DEFAULT 'ready';
