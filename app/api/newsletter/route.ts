import { deliver } from "@/lib/forms/delivery";
import { allowRequest, clientKey } from "@/lib/forms/rate-limit";
import { deliveryResponse, formError, formOk, readJson } from "@/lib/forms/respond";
import { isValidEmail, leadMessages } from "@/lib/forms/validation";

/** Receives newsletter sign-ups from the journal page. */
export async function POST(request: Request): Promise<Response> {
  if (!allowRequest(clientKey(request))) return formError("rate_limited", 429);

  const body = await readJson(request, 2_000);
  const record = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : {};
  const email = typeof record.email === "string" ? record.email.trim() : "";
  if (email.length > 160 || !isValidEmail(email)) {
    return formError("validation", 422, leadMessages.email);
  }

  if (typeof record.website === "string" && record.website !== "") return formOk();

  return deliveryResponse(await deliver("newsletter", { email }));
}
