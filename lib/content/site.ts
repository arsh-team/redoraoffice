/**
 * Site-wide facts. Everything here is taken from the reference site's homepage
 * and its Organization JSON-LD block (present on every reference page).
 */
export const site = {
  name: "REDORA Office",
  brand: "Redora Office",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://redoraoffice.ir").replace(/\/+$/, ""),
  locale: "fa_IR",
  defaultTitle: "Redora Office | طراحی آشپزخانه",
  description:
    "Redora Office؛ طراحی و اجرای آشپزخانه و فضاهای داخلی با تمرکز بر کیفیت، متریال و جزئیات.",
  phone: "0912-691-1586",
  phoneHref: "tel:+989126911586",
  email: "info@redoraoffice.ir",
  emailHref: "mailto:info@redoraoffice.ir",
  locality: "تهران، ایران",
  copyright: "© 2026 Redora Office — تمامی حقوق محفوظ است.",
} as const;

export function absoluteUrl(path = "/"): string {
  if (path === "/" || path === "") return site.url;
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
