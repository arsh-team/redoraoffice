import { deliver } from "@/lib/forms/delivery";
import { allowRequest, clientKey } from "@/lib/forms/rate-limit";
import { deliveryResponse, formError, formOk, readJson } from "@/lib/forms/respond";
import { leadMessages, parseLead } from "@/lib/forms/validation";

/** Receives consultation requests and project briefs from every form on the site. */
export async function POST(request: Request): Promise<Response> {
  if (!allowRequest(clientKey(request))) return formError("rate_limited", 429);

  const result = parseLead(await readJson(request));
  if (!result.ok) return formError("validation", 422, result.message ?? leadMessages.required);

  // Honeypot filled in: accept silently so bots get no signal, but deliver nothing.
  const { website, ...lead } = result.data;
  if (website) return formOk();

  return deliveryResponse(await deliver("contact", lead));
}
