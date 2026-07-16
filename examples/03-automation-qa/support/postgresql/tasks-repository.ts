import type { Client, PoolClient, QueryResult } from "pg";

type QueryClient = Pick<Client | PoolClient, "query">;

type TaskRow = {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "high";
  description: string | null;
  owner_id: string | null;
  estimated_hours: string | null;
  created_at: Date;
};

export type TaskRecord = {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "high";
  description: string | null;
  ownerId: string | null;
  estimatedHours: number | null;
  createdAt: string;
};

const mapTaskRow = (row: TaskRow): TaskRecord => ({
  id: row.id,
  title: row.title,
  completed: row.completed,
  priority: row.priority,
  description: row.description,
  ownerId: row.owner_id,
  estimatedHours: row.estimated_hours === null
    ? null
    : parseDatabaseNumber(row.estimated_hours),
  createdAt: normalizeTimestamp(row.created_at),
});

const parseDatabaseNumber = (value: string): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid PostgreSQL numeric value: ${value}`);
  }
  return parsed;
};

const normalizeTimestamp = (value: Date): string => {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
    throw new Error("Invalid PostgreSQL timestamp value");
  }
  return value.toISOString();
};

export class TasksRepository {
  constructor(private readonly client: QueryClient) {}

  async createOwner(id: string, name: string): Promise<void> {
    await this.client.query(
      "INSERT INTO owners (id, name) VALUES ($1, $2)",
      [id, name],
    );
  }

  async createTask(input: {
    id: string;
    title: string;
    priority: "low" | "high";
    description?: string | null;
    ownerId?: string | null;
    estimatedHours?: number | null;
  }): Promise<TaskRecord> {
    const result = await this.client.query<TaskRow>(
      `INSERT INTO tasks (
        id, title, priority, description, owner_id, estimated_hours
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, title, completed, priority, description, owner_id,
        estimated_hours, created_at`,
      [
        input.id,
        input.title,
        input.priority,
        input.description ?? null,
        input.ownerId ?? null,
        input.estimatedHours ?? null,
      ],
    );
    const row = result.rows[0];
    if (row === undefined) {
      throw new Error("INSERT ... RETURNING did not return the created task");
    }
    return mapTaskRow(row);
  }

  async findTask(id: string): Promise<TaskRecord | undefined> {
    const result = await this.client.query<TaskRow>(
      `SELECT id, title, completed, priority, description, owner_id,
        estimated_hours, created_at
      FROM tasks
      WHERE id = $1`,
      [id],
    );
    return result.rows[0] === undefined ? undefined : mapTaskRow(result.rows[0]);
  }

  async listTasks(): Promise<TaskRecord[]> {
    const result = await this.client.query<TaskRow>(
      `SELECT id, title, completed, priority, description, owner_id,
        estimated_hours, created_at
      FROM tasks
      ORDER BY id`,
    );
    return result.rows.map(mapTaskRow);
  }

  async deleteTask(id: string): Promise<number> {
    const result: QueryResult = await this.client.query(
      "DELETE FROM tasks WHERE id = $1",
      [id],
    );
    return result.rowCount ?? 0;
  }
}
