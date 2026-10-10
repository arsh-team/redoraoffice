import { site } from "./site";

export type NavKey = "home" | "about" | "services" | "projects" | "blog" | "contact";

export interface NavItem {
  key: NavKey;
  href: string;
  label: string;
}

export const mainNav: readonly NavItem[] = [
  { key: "home", href: "/", label: "صفحه اصلی" },
  { key: "about", href: "/about", label: "درباره ما" },
  { key: "services", href: "/services", label: "خدمات" },
  { key: "projects", href: "/projects", label: "نمونه کارها" },
  { key: "blog", href: "/blog", label: "مقالات" },
  { key: "contact", href: "/contact", label: "تماس با ما" },
];

export const headerCta = { href: "/contact", label: "درخواست مشاوره" } as const;

interface FooterLink {
  href: string;
  label: string;
}

export interface FooterContent {
  tagline: string;
  links: readonly FooterLink[];
  /** Heading of the third column. */
  contactTitle: string;
  /** Plain text lines in the third column. */
  contactLines: readonly string[];
  /** Optional link rendered after the contact lines. */
  contactLink?: FooterLink;
}

const home: FooterLink = { href: "/", label: "صفحه اصلی" };
const about: FooterLink = { href: "/about", label: "درباره ما" };
const services: FooterLink = { href: "/services", label: "خدمات" };
const projects: FooterLink = { href: "/projects", label: "نمونه‌کارها" };
const blog: FooterLink = { href: "/blog", label: "مقالات" };

const tagline =
  "طراحی آشپزخانه‌های مدرن، کاربردی و الهام‌بخش با تمرکز بر کیفیت، جزئیات و سبک زندگی شما.";
const contactLines = [site.phone, site.email, site.locality] as const;

/**
 * The reference renders a slightly different footer on each page type
 * (different quick links, and a different third column on detail pages).
 */
export const footers = {
  home: { tagline, links: [home, about, services, projects], contactTitle: "اطلاعات تماس", contactLines },
  about: { tagline, links: [home, about, services, projects], contactTitle: "اطلاعات تماس", contactLines },
  services: { tagline, links: [home, services, projects], contactTitle: "اطلاعات تماس", contactLines },
  projects: { tagline, links: [home, projects, services], contactTitle: "اطلاعات تماس", contactLines },
  blog: { tagline, links: [home, about, services, projects], contactTitle: "اطلاعات تماس", contactLines },
  contact: {
    tagline,
    links: [home, about, services, projects, blog],
    contactTitle: "اطلاعات تماس",
    contactLines,
  },
  projectDetail: {
    tagline: "طراحی برای زندگی؛ با تمرکز بر کیفیت، جزئیات و معماری ماندگار.",
    links: [projects, services],
    contactTitle: "شروع همکاری",
    contactLines: [site.phone],
    contactLink: { href: "/contact", label: "درخواست مشاوره ←" },
  },
  article: {
    tagline: "طراحی آشپزخانه‌های مدرن، کاربردی و الهام‌بخش.",
    links: [{ href: "/blog", label: "مجله" }, projects, services],
    contactTitle: "اطلاعات تماس",
    contactLines: [site.phone, site.email],
  },
} as const satisfies Record<string, FooterContent>;

export type FooterVariant = keyof typeof footers;
