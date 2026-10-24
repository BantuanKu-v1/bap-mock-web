import { D1Database } from "@cloudflare/workers-types";

const SESSION_DURATION_SECONDS = 60 * 60 * 8;

async function hashToken(token: string): Promise<string> {
  const encoded = new TextEncoder().encode(token);
  const hash = await crypto.subtle.digest("SHA-256", encoded);

  return Array.from(new Uint8Array(hash))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
}

export async function createAdminSession(db: D1Database) {
  const token = crypto.randomUUID() + crypto.randomUUID();
  const tokenHash = await hashToken(token);

  const expiresAt = new Date(
      Date.now() + SESSION_DURATION_SECONDS * 1000
  ).toISOString();

  await db
      .prepare(
          `INSERT INTO admin_sessions (
        id,
        token_hash,
        expires_at
      )
      VALUES (?, ?, ?)`
      )
      .bind(crypto.randomUUID(), tokenHash, expiresAt)
      .run();

  return {
    token,
    maxAge: SESSION_DURATION_SECONDS,
  };
}

export async function verifyAdminSession(
    db: D1Database,
    token: string
): Promise<boolean> {
  const tokenHash = await hashToken(token);

  const session = await db
      .prepare(
          `SELECT id
       FROM admin_sessions
       WHERE token_hash = ?
         AND expires_at > ?`
      )
      .bind(tokenHash, new Date().toISOString())
      .first();

  return Boolean(session);
}

export async function deleteAdminSession(
    db: D1Database,
    token: string
): Promise<void> {
  const tokenHash = await hashToken(token);

  await db
      .prepare(
          `DELETE FROM admin_sessions
       WHERE token_hash = ?`
      )
      .bind(tokenHash)
      .run();
}
