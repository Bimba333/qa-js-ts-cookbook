import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

/**
 * Учебные параметры scrypt. Они намеренно фиксированы и одинаковы для seed и
 * runtime, поэтому hash seed-пользователя воспроизводим при каждой генерации.
 */
const SCRYPT_PARAMETERS = Object.freeze({
  cost: 16_384,
  blockSize: 8,
  parallelization: 1,
  keyLengthBytes: 32,
  saltLengthBytes: 16,
});

const HEX_SALT = /^[0-9a-f]{32}$/;
const HEX_HASH = /^[0-9a-f]{64}$/;

export type PasswordRecord = Readonly<{
  salt: string;
  hash: string;
}>;

async function derive(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise<Buffer>((resolve, reject) => {
    scrypt(
      password.normalize("NFKC"),
      salt,
      SCRYPT_PARAMETERS.keyLengthBytes,
      {
        N: SCRYPT_PARAMETERS.cost,
        r: SCRYPT_PARAMETERS.blockSize,
        p: SCRYPT_PARAMETERS.parallelization,
      },
      (error, derivedKey) => {
        if (error) reject(error);
        else resolve(derivedKey);
      },
    );
  });
}

/**
 * Считает hash для заданной соли. Детерминированная соль используется только
 * для seed-данных, чтобы учебная база была воспроизводима.
 */
export async function hashPasswordWithSalt(
  password: string,
  salt: string,
): Promise<PasswordRecord> {
  if (!HEX_SALT.test(salt)) {
    throw new Error("Password salt must be 16 hex-encoded bytes");
  }

  const derived = await derive(password, Buffer.from(salt, "hex"));

  return Object.freeze({ salt, hash: derived.toString("hex") });
}

export async function hashPassword(password: string): Promise<PasswordRecord> {
  const salt = randomBytes(SCRYPT_PARAMETERS.saltLengthBytes).toString("hex");

  return hashPasswordWithSalt(password, salt);
}

/**
 * Сравнение выполняется constant-time. Некорректно сохранённый credential
 * material считается несовпадением, а не внутренней ошибкой: транспорт должен
 * вернуть обычный отказ аутентификации без деталей.
 */
export async function verifyPassword(
  password: string,
  record: PasswordRecord,
): Promise<boolean> {
  if (!HEX_SALT.test(record.salt) || !HEX_HASH.test(record.hash)) {
    return false;
  }

  const derived = await derive(password, Buffer.from(record.salt, "hex"));
  const expected = Buffer.from(record.hash, "hex");

  if (derived.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(derived, expected);
}
