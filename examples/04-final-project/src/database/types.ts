/** Строка таблицы, а не модель предметной области: имена как в базе. */
export type WorkItemRow = Readonly<{
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  test_run_id: string | null;
  creator_test_id: string | null;
  is_seed: boolean;
  version: number;
  created_at: Date;
}>;

export type DatabaseSettings = Readonly<{
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}>;
