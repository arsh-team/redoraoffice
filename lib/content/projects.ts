import type { ImageKey } from "./images";

export type ProjectFilter = "modern" | "minimal" | "classic";

export interface Project {
  slug: string;
  title: string;
  /** English category label shown in small caps on cards and detail pages. */
  category: string;
  filter: ProjectFilter;
  /** Colour scheme of the archive card panel. */
  tone: "dark" | "light";
  summary: string;
  location: string;
  /** Floor area in square metres. */
  area: number;
  cover: ImageKey;
}

export const projectFilters: readonly { key: "all" | ProjectFilter; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "modern", label: "مدرن" },
  { key: "minimal", label: "مینیمال" },
  { key: "classic", label: "کلاسیک معاصر" },
];

/** Order matters: it drives the card numbering and the "next project" cycle. */
export const projects: readonly Project[] = [
  {
    slug: "lavassan",
    title: "ویلای لواسان",
    category: "RESIDENTIAL",
    filter: "modern",
    tone: "dark",
    summary: "طراحی و اجرای کامل فضای داخلی با متریال سنگ، چوب و فلز.",
    location: "لواسان",
    area: 140,
    cover: "dark",
  },
  {
    slug: "farmanieh",
    title: "پروژه فرمانیه",
    category: "APARTMENT",
    filter: "minimal",
    tone: "light",
    summary: "بازسازی کامل و طراحی دکوراسیون داخلی با رویکرد مدرن و آرام.",
    location: "فرمانیه",
    area: 120,
    cover: "light",
  },
  {
    slug: "niavaran",
    title: "خانه نیاوران",
    category: "CONTEMPORARY",
    filter: "classic",
    tone: "dark",
    summary: "فضایی گرم و معاصر با تمرکز بر نور، جزئیات و عملکرد روزمره.",
    location: "نیاوران",
    area: 95,
    cover: "hero",
  },
  {
    slug: "kordan",
    title: "ویلای کردان",
    category: "VILLA",
    filter: "modern",
    tone: "light",
    summary: "ترکیب متریال روشن، خطوط نرم و جزئیات سفارشی برای یک ویلای مدرن.",
    location: "کردان",
    area: 170,
    cover: "light",
  },
  {
    slug: "saadatabad",
    title: "رزیدنس سعادت‌آباد",
    category: "APARTMENT",
    filter: "minimal",
    tone: "light",
    summary: "بازطراحی یکپارچه با کابینت‌های سفارشی و پالت متریال مونوکروم.",
    location: "سعادت‌آباد",
    area: 80,
    cover: "dark",
  },
  {
    slug: "elahiyeh",
    title: "آپارتمان الهیه",
    category: "TIMELESS",
    filter: "classic",
    tone: "dark",
    summary: "طراحی آرام و ماندگار با جزئیات دقیق، نور گرم و متریال طبیعی.",
    location: "الهیه",
    area: 135,
    cover: "hero",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** The reference links each case study to the next one in order, wrapping around. */
export function getNextProject(slug: string): Project {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}

/**
 * Gallery composition used by every reference case study:
 * cover (large), light kitchen, cover again, dark kitchen.
 */
export function getProjectGallery(project: Project): readonly ImageKey[] {
  return [project.cover, "light", project.cover, "dark"];
}

/**
 * Copy that the reference repeats verbatim on every case-study page.
 * It is template text on the source site, not per-project content.
 */
export const projectDetailCopy = {
  kicker: "پروژه منتخب REDORA",
  introLabel: "معرفی پروژه",
  introHeadingSuffix: "تعادل میان زیبایی و عملکرد",
  yearPlaceholder: "—",
  materialsSummary: "سنگ طبیعی، چوب",
  features: [
    {
      icon: "◇",
      title: "متریال‌های طبیعی",
      text: "انتخاب متریال‌های اصیل و ماندگار برای ایجاد حس گرم و لوکس.",
    },
    {
      icon: "▦",
      title: "طراحی مدرن",
      text: "فرم‌های ساده و خطوط دقیق، متناسب با معماری و سبک زندگی.",
    },
    { icon: "♙", title: "اجرای تخصصی", text: "کنترل جزئیات اجرایی توسط تیم متخصص Redora." },
    {
      icon: "♢",
      title: "زیبایی ماندگار",
      text: "طراحی‌ای که وابسته به مد روز نیست و کیفیت خود را حفظ می‌کند.",
    },
  ],
  featureCaption: "جزئیات، تفاوت را می‌سازند",
  materials: [
    { sample: "pdMat1", name: "مرمریت روشن", note: "سنگ طبیعی" },
    { sample: "pdMat2", name: "تراورتن", note: "بافت گرم" },
    { sample: "pdMat3", name: "گرانیت مشکی", note: "سنگ تیره" },
    { sample: "pdMat4", name: "چوب طبیعی", note: "جزئیات سفارشی" },
  ],
  challenge: {
    icon: "◎",
    title: "چالش پروژه",
    text: "خلق فضایی یکپارچه، آرام و کاربردی؛ با حفظ هویت معماری و توجه دقیق به تناسبات، نور و متریال.",
  },
  solution: {
    icon: "◉",
    title: "راهکار",
    text: "با ساده‌سازی فرم‌ها، انتخاب پالت محدود متریال و اجرای دقیق جزئیات، فضایی منسجم و ماندگار شکل گرفت.",
  },
} as const;
