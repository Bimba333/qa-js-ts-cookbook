import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt);

const KEY_LENGTH = 64;

/**
 * Хеш пароля хранится вместе со своей солью и параметрами.
 *
 * Сравнение идёт постоянным по времени: иначе по длительности ответа можно
 * было бы подбирать хеш побайтно.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;

  return `scrypt$${salt}$${derived.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const [algorithm, salt, hash] = stored.split("$");

  if (algorithm !== "scrypt" || !salt || !hash) {
    return false;
  }

  const derived = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  const expected = Buffer.from(hash, "hex");

  if (expected.length !== derived.length) {
    return false;
  }

  return timingSafeEqual(derived, expected);
}
