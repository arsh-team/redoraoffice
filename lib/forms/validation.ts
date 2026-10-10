/**
 * Validation shared by the browser forms and the API route handlers.
 * The route handlers never trust the client: they run the same checks again.
 */

export interface LeadInput {
  /** Which form produced the request. */
  source: "home" | "compact" | "project-brief";
  name: string;
  phone: string;
  type?: string;
  message?: string;
  style?: string;
  area?: string;
  city?: string;
  spaceStatus?: string;
  budget?: string;
  timeline?: string;
  email?: string;
  /** Honeypot: real visitors never see or fill this field. */
  website?: string;
}

export type LeadField = keyof LeadInput;

export const leadMessages = {
  contact: "لطفاً نام و شماره تماس معتبر وارد کنید.",
  email: "لطفاً یک نشانی ایمیل معتبر وارد کنید.",
  required: "لطفاً فیلدهای ضروری را کامل کنید.",
  choice: "لطفاً یک گزینه را انتخاب کنید.",
} as const;

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

/** Converts Persian and Arabic-Indic digits to ASCII digits. */
export function toLatinDigits(value: string): string {
  return value.replace(/[۰-۹٠-٩]/g, (digit) => {
    const persian = PERSIAN_DIGITS.indexOf(digit);
    return String(persian >= 0 ? persian : ARABIC_DIGITS.indexOf(digit));
  });
}

export function normalizePhone(value: string): string {
  return toLatinDigits(value).replace(/\s/g, "");
}

/** Same rule as the reference's consultation form: optional "+", then 8–15 digits or dashes. */
export function isValidPhone(value: string): boolean {
  return /^[+\d][\d-]{7,14}$/.test(normalizePhone(value));
}

export function isValidName(value: string): boolean {
  return value.trim().length >= 2;
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
}

const LIMITS: Record<Exclude<LeadField, "source">, number> = {
  name: 120,
  phone: 24,
  type: 80,
  message: 3000,
  style: 80,
  area: 8,
  city: 80,
  spaceStatus: 80,
  budget: 80,
  timeline: 80,
  email: 160,
  website: 200,
};

const SOURCES: readonly LeadInput["source"][] = ["home", "compact", "project-brief"];

export type LeadResult =
  | { ok: true; data: LeadInput }
  | { ok: false; field: LeadField; message: string };

/** Parses and validates untrusted input into a clean lead. */
export function parseLead(input: unknown): LeadResult {
  if (typeof input !== "object" || input === null) {
    return { ok: false, field: "name", message: leadMessages.required };
  }
  const record = input as Record<string, unknown>;
  const source = SOURCES.find((value) => value === record.source);
  if (!source) return { ok: false, field: "source", message: leadMessages.required };

  const data: LeadInput = { source, name: "", phone: "" };
  for (const field of Object.keys(LIMITS) as (keyof typeof LIMITS)[]) {
    const value = record[field];
    if (value === undefined || value === null || value === "") continue;
    if (typeof value !== "string" || value.length > LIMITS[field]) {
      return { ok: false, field, message: leadMessages.required };
    }
    data[field] = value.trim();
  }

  if (!isValidName(data.name) || !isValidPhone(data.phone)) {
    return { ok: false, field: isValidName(data.name) ? "phone" : "name", message: leadMessages.contact };
  }
  if (data.email && !isValidEmail(data.email)) {
    return { ok: false, field: "email", message: leadMessages.email };
  }
  data.phone = normalizePhone(data.phone);
  return { ok: true, data };
}
