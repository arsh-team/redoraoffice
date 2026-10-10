import "server-only";
import type { DeliveryResult } from "./delivery";

export type FormErrorCode = "validation" | "rate_limited" | "not_configured" | "failed";

export function formError(code: FormErrorCode, status: number, message?: string): Response {
  return Response.json({ ok: false, code, ...(message ? { message } : {}) }, { status });
}

export function formOk(): Response {
  return Response.json({ ok: true });
}

/** Maps a delivery outcome to an HTTP response the browser forms understand. */
export function deliveryResponse(result: DeliveryResult): Response {
  if (result === "sent") return formOk();
  if (result === "not_configured") return formError("not_configured", 503);
  return formError("failed", 502);
}

/** Reads a JSON body without throwing on malformed or oversized input. */
export async function readJson(request: Request, maxBytes = 16_000): Promise<unknown> {
  try {
    const text = await request.text();
    if (text.length > maxBytes) return null;
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}
