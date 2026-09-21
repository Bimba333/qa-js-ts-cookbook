import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Читает исходный текст proto-контракта стенда.
 *
 * Расположение файла — деталь инфраструктуры, поэтому оно задано в одном
 * месте: тест спрашивает контракт, а не путь к нему.
 */
export async function readWorkItemsContract(): Promise<string> {
  const contractPath = path.resolve(
    process.cwd(),
    "sut",
    "contracts",
    "proto",
    "work_items.proto",
  );

  return readFile(contractPath, "utf8");
}
