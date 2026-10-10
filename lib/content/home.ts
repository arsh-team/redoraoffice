import type { ImageKey } from "./images";

/** Homepage collections, transcribed from https://redoraoffice.ir/. */

export const heroSlides: readonly { image: ImageKey; alt: string; label: string; title: string }[] = [
  { image: "hero", alt: "آشپزخانه لوکس Redora", label: "PROJECT 01", title: "Modern Warm Kitchen" },
  { image: "dark", alt: "آشپزخانه تیره مدرن", label: "PROJECT 02", title: "Dark Stone Kitchen" },
  { image: "light", alt: "آشپزخانه روشن مینیمال", label: "PROJECT 03", title: "Soft Minimal Kitchen" },
];

export const heroHighlights: readonly { number: string; label: string }[] = [
  { number: "01", label: "طراحی اختصاصی" },
  { number: "02", label: "متریال منتخب" },
  { number: "03", label: "اجرای دقیق" },
];

export const heroStats: readonly { value: string; label: string }[] = [
  { value: "+120", label: "پروژه موفق" },
  { value: "+8", label: "سال تجربه" },
  { value: "100%", label: "رضایت مشتریان" },
  { value: "+500", label: "همکاری رضایت‌بخش" },
];

export const benefits: readonly { icon: string; title: string; text: string }[] = [
  { icon: "◇", title: "طراحی اختصاصی", text: "بر اساس نیاز و سلیقه شما" },
  { icon: "⌘", title: "اجرای دقیق", text: "با تیم حرفه‌ای و مجرب" },
  { icon: "⬡", title: "متریال با کیفیت", text: "از برندهای معتبر جهانی" },
  { icon: "◎", title: "مشاوره تخصصی", text: "از ایده تا اجرا کنار شما" },
];

export const homeServices: readonly { image: ImageKey; title: string; text: string }[] = [
  { image: "hero", title: "طراحی آشپزخانه مسکونی", text: "طراحی بر اساس سبک زندگی" },
  { image: "light", title: "طراحی آشپزخانه مدرن", text: "فضایی مینیمال و کاربردی" },
  { image: "dark", title: "بازطراحی و نوسازی", text: "تحول فضاهای قدیمی" },
  { image: "hero", title: "انتخاب متریال", text: "هماهنگی چوب، سنگ و رنگ" },
];

export const homeProjectFilters = ["همه", "مدرن", "کلاسیک", "مینیمال"] as const;
export type HomeProjectFilter = (typeof homeProjectFilters)[number];

/**
 * Featured projects. On the reference all three cards link to /projects/lavassan;
 * each card is linked to the case study it names instead.
 */
export const homeProjects: readonly {
  slug: string;
  title: string;
  caption: string;
  category: Exclude<HomeProjectFilter, "همه">;
  image: ImageKey;
  big?: boolean;
}[] = [
  { slug: "lavassan", title: "پروژه لواسان", caption: "طراحی مدرن", category: "مدرن", image: "dark", big: true },
  { slug: "niavaran", title: "پروژه نیاوران", caption: "سبک مینیمال", category: "مینیمال", image: "hero" },
  { slug: "farmanieh", title: "پروژه فرمانیه", caption: "ترکیب چوب و سنگ", category: "کلاسیک", image: "light" },
];

export const inspiration: readonly { image: ImageKey; alt: string; caption: string; wide?: boolean }[] = [
  { image: "dark", alt: "آشپزخانه مدرن خاکستری", caption: "ترکیب خاکستری و سنگ روشن", wide: true },
  { image: "hero", alt: "آشپزخانه سفید", caption: "سفید مینیمال با جزیره تیره" },
  { image: "dark", alt: "جزیره آشپزخانه", caption: "جزیره بزرگ برای فضای خانوادگی" },
  { image: "hero", alt: "آشپزخانه چوبی روشن", caption: "چوب طبیعی و کابینت روشن" },
];

export const processSteps: readonly { number: string; icon: string; title: string; text: string }[] = [
  { number: "01", icon: "◎", title: "مشاوره و نیازسنجی", text: "بررسی نیازها و سبک زندگی شما" },
  { number: "02", icon: "◇", title: "طراحی مفهومی", text: "ارائه ایده و کانسپت اولیه" },
  { number: "03", icon: "⬡", title: "طراحی نهایی", text: "جزئیات فنی و انتخاب متریال" },
  { number: "04", icon: "⌘", title: "اجرا و نظارت", text: "کنترل کیفیت در تمام مراحل" },
  { number: "05", icon: "✓", title: "تحویل و پشتیبانی", text: "همراهی ما حتی پس از اجرا" },
];

export const testimonial = {
  quote:
    "«تجربه همکاری با Redora Office فراتر از انتظار ما بود؛ از طراحی دقیق تا اجرای باکیفیت، همه‌چیز منظم و حرفه‌ای پیش رفت.»",
  rating: "4.9 ★★★★★",
} as const;

/**
 * Journal teasers. These three titles do not correspond to published articles
 * on the reference (and its cards are not links), so they point at the archive.
 */
export const homeArticles: readonly { image: ImageKey; title: string; text: string }[] = [
  { image: "dark", title: "ترندهای طراحی آشپزخانه مدرن", text: "ایده‌هایی برای یک فضای ماندگار و امروزی" },
  { image: "hero", title: "راهنمای انتخاب متریال مناسب", text: "چوب، سنگ و رنگ را چطور هماهنگ کنیم؟" },
  { image: "dark", title: "۱۰ ایده برای آشپزخانه کوچک", text: "استفاده هوشمندانه از هر سانتی‌متر فضا" },
];

export const homeFaqs: readonly { question: string; answer: string }[] = [
  {
    question: "طراحی یک آشپزخانه چقدر زمان می‌برد؟",
    answer: "بسته به ابعاد و جزئیات پروژه، فاز طراحی معمولاً بین ۲ تا ۴ هفته زمان نیاز دارد.",
  },
  {
    question: "آیا قبل از اجرا رندر سه‌بعدی ارائه می‌شود؟",
    answer:
      "بله، پیش از اجرا می‌توانید ترکیب کلی فضا، متریال و رنگ‌ها را در رندر سه‌بعدی بررسی کنید.",
  },
  {
    question: "امکان طراحی متناسب با بودجه وجود دارد؟",
    answer: "بله، پیشنهاد متریال و جزئیات اجرایی با توجه به بودجه و اولویت‌های پروژه تنظیم می‌شود.",
  },
];

export const homeConsultTypes = ["طراحی آشپزخانه", "بازطراحی و نوسازی"] as const;
