import "server-only";

/**
 * INTEGRATION POINT — where submitted forms leave this application.
 *
 * The reference site posts its forms to a Laravel backend that is not part of
 * this repository. Here each submission is forwarded as JSON to a webhook URL
 * taken from the environment (see .env.example):
 *
 *   CONTACT_WEBHOOK_URL      consultation requests and project briefs
 *   NEWSLETTER_WEBHOOK_URL   newsletter sign-ups
 *
 * Any endpoint that accepts a JSON POST works (the existing Laravel app, a CRM,
 * Formspree, n8n, Make, Zapier, …). To deliver somewhere else — e-mail, a
 * database — replace the body of `deliver` and keep its return contract.
 *
 * When no URL is configured nothing is sent and "not_configured" is returned;
 * the forms then tell the visitor plainly that the request was not delivered.
 */

export type DeliveryResult = "sent" | "not_configured" | "failed";

const endpoints = {
  contact: () => process.env.CONTACT_WEBHOOK_URL,
  newsletter: () => process.env.NEWSLETTER_WEBHOOK_URL,
} as const;

export async function deliver(
  kind: keyof typeof endpoints,
  payload: Record<string, unknown>,
): Promise<DeliveryResult> {
  const url = endpoints[kind]();
  if (!url) return "not_configured";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ kind, submittedAt: new Date().toISOString(), ...payload }),
      signal: AbortSignal.timeout(10_000),
      cache: "no-store",
    });
    if (!response.ok) {
      console.error(`[forms] ${kind} webhook responded with ${response.status}`);
      return "failed";
    }
    return "sent";
  } catch (error) {
    console.error(`[forms] ${kind} webhook request failed`, error instanceof Error ? error.message : error);
    return "failed";
  }
}
