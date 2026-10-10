import "server-only";

/**
 * Small in-memory limiter to blunt form spam. It is per server instance, so on
 * serverless or multi-instance hosting it is a first line of defence only —
 * put a shared store or the platform's rate limiting in front for stronger guarantees.
 */
const WINDOW_MS = 10 * 60 * 1000;
/** Requests allowed per client per window; override with FORM_RATE_LIMIT_MAX. */
const MAX_REQUESTS = Number(process.env.FORM_RATE_LIMIT_MAX) || 6;
const MAX_TRACKED_CLIENTS = 5000;

const hits = new Map<string, number[]>();

export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

/** Returns true when the caller is still within its allowance. */
export function allowRequest(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > MAX_TRACKED_CLIENTS) {
    const oldest = hits.keys().next().value;
    if (oldest !== undefined) hits.delete(oldest);
  }
  return true;
}
