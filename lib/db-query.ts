import { logDbFallback } from "@/lib/db-fallback";

const DB_TIMEOUT_MS = Number(process.env.DB_QUERY_TIMEOUT_MS ?? 5000);

/** Run a DB query with a timeout; fall back quickly if MongoDB is slow or unreachable. */
export async function queryDb<T>(scope: string, query: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await Promise.race([
      query(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Database timeout")), DB_TIMEOUT_MS);
      })
    ]);
  } catch {
    logDbFallback(scope);
    return fallback();
  }
}
