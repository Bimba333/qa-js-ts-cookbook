import { createHash } from "node:crypto";
import { lstat, readdir, readFile, realpath } from "node:fs/promises";
import path from "node:path";
import { TextDecoder } from "node:util";

export type Migration = Readonly<{
  version: number;
  name: string;
  checksum: string;
  sql: string;
  filename: string;
}>;

const MIGRATION_FILENAME = /^(\d{3})-([a-z0-9-]+)\.sql$/;
const UTF8_DECODER = new TextDecoder("utf-8", { fatal: true });

export function defaultMigrationDirectory(): string {
  return path.resolve(process.cwd(), "sut/migrations");
}

async function assertAllowedDirectory(directory: string): Promise<string> {
  const resolved = await realpath(directory);
  const allowedRoots = [
    await realpath(path.resolve(process.cwd(), "sut/migrations")),
    await realpath(
      path.resolve(process.cwd(), "sut/tests/fixtures/migrations"),
    ),
  ];

  if (
    !allowedRoots.some(
      (root) => resolved === root || resolved.startsWith(`${root}${path.sep}`),
    )
  ) {
    throw new Error("Migration directory находится вне разрешённой границы");
  }

  return resolved;
}

export function validateMigrationSequence(migrations: readonly Migration[]): void {
  const seen = new Set<number>();

  for (const [index, migration] of migrations.entries()) {
    if (seen.has(migration.version)) {
      throw new Error(`Duplicate migration version: ${migration.version}`);
    }
    seen.add(migration.version);

    const expectedVersion = index + 1;
    if (migration.version !== expectedVersion) {
      throw new Error(
        `Migration gap: expected ${expectedVersion}, received ${migration.version}`,
      );
    }
  }
}

export function normalizeMigrationSql(bytes: Uint8Array): string {
  const decoded = UTF8_DECODER.decode(bytes);
  const normalized = decoded.replaceAll("\r\n", "\n");

  if (normalized.includes("\r")) {
    throw new Error("Migration contains unsupported bare CR line endings");
  }

  return normalized;
}

export async function loadMigrations(
  directory = defaultMigrationDirectory(),
): Promise<readonly Migration[]> {
  const approvedDirectory = await assertAllowedDirectory(directory);
  const filenames = (await readdir(approvedDirectory))
    .filter((filename) => filename.endsWith(".sql"))
    .sort((left, right) => left.localeCompare(right, "en"));

  const migrations: Migration[] = [];

  for (const filename of filenames) {
    const match = MIGRATION_FILENAME.exec(filename);
    if (!match) {
      throw new Error(`Invalid migration filename: ${filename}`);
    }

    const filePath = path.join(approvedDirectory, filename);
    const fileState = await lstat(filePath);
    if (fileState.isSymbolicLink() || !fileState.isFile()) {
      throw new Error(`Migration must be a regular file: ${filename}`);
    }

    const resolvedFile = await realpath(filePath);
    if (!resolvedFile.startsWith(`${approvedDirectory}${path.sep}`)) {
      throw new Error(`Migration file находится вне разрешённой границы: ${filename}`);
    }

    const sql = normalizeMigrationSql(await readFile(resolvedFile));
    if (sql.trim().length === 0) {
      throw new Error(`Empty migration: ${filename}`);
    }

    migrations.push(
      Object.freeze({
        version: Number(match[1]),
        name: match[2],
        checksum: createHash("sha256").update(sql).digest("hex"),
        sql,
        filename,
      }),
    );
  }

  validateMigrationSequence(migrations);
  return Object.freeze(migrations);
}
