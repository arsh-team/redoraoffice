import type { ImageKey } from "./images";

export type ArticleCategory = "design" | "material" | "trend" | "guide";

export const articleCategories: readonly { key: "all" | ArticleCategory; label: string }[] = [
  { key: "all", label: "همه" },
  { key: "design", label: "طراحی" },
  { key: "material", label: "متریال" },
  { key: "trend", label: "ترند و ایده" },
  { key: "guide", label: "راهنما" },
];

export type ArticleBlock =
  | { type: "lead"; text: string }
  | { type: "heading"; id: string; text: string }
  | { type: "paragraph"; text: string }
  | { type: "pull"; label: string; text: string }
  | { type: "figure"; image: ImageKey; caption: string; organic?: boolean }
  | { type: "checklist"; title: string; items: readonly string[] }
  | { type: "quote"; text: string };

export interface ArticleBody {
  eyebrow: string;
  /** Hero heading: a plain first line and an emphasised second line. */
  heading: { line: string; emphasis: string };
  author: string;
  readingTime: string;
  published: string;
  /** ISO date from the reference page's Article structured data. */
  publishedIso: string;
  cover: ImageKey;
  toc: readonly { id: string; label: string }[];
  blocks: readonly ArticleBlock[];
  tags: string;
  related: readonly { slug: string; image: ImageKey; tag: string; title: string }[];
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: ArticleCategory;
  /** Category label exactly as printed on the archive card. */
  categoryLabel: string;
  /** Reading time in minutes, as printed on the archive card. */
  minutes: number | null;
  cover: ImageKey;
  /** Card shape in the archive grid. */
  layout: "default" | "tall" | "wide";
  featured?: boolean;
  body: ArticleBody;
}

/**
 * VERIFIED CONTENT — transcribed from https://redoraoffice.ir/blog/kitchen-decisions.
 *
 * The reference site currently serves this exact hero and body for every
 * /blog/{slug} URL (only <title> and the meta description change per slug).
 * No other article text exists on the source, so none has been invented here:
 * all six articles point at this body until real copy is supplied.
 * See docs/reference-audit.md → "Article detail".
 */
const kitchenDecisionsBody: ArticleBody = {
  eyebrow: "DESIGN GUIDE",
  heading: { line: "۷ تصمیمی که قبل از طراحی", emphasis: "آشپزخانه باید بگیرید." },
  author: "تحریریه Redora",
  readingTime: "۸ دقیقه مطالعه",
  published: "شهریور ۱۴۰۵",
  publishedIso: "2026-09-27T05:29:03+03:30",
  cover: "hero",
  toc: [
    { id: "plan", label: "01 · سبک زندگی و پلان" },
    { id: "island", label: "02 · جزیره و مسیر حرکت" },
    { id: "material", label: "03 · متریال" },
    { id: "light", label: "04 · نورپردازی" },
    { id: "storage", label: "05 · ذخیره‌سازی" },
  ],
  blocks: [
    {
      type: "lead",
      text: "طراحی آشپزخانه از انتخاب رنگ کابینت شروع نمی‌شود. تصمیم‌های مهم‌تر، خیلی زودتر و در لایه‌ای عمیق‌تر گرفته می‌شوند؛ جایی که عادت‌های روزانه، حرکت در فضا و کیفیت نور تعریف می‌شوند.",
    },
    { type: "heading", id: "plan", text: "01. اول سبک زندگی، بعد پلان" },
    {
      type: "paragraph",
      text: "قبل از هر ترسیم، باید بدانید چه کسی بیشتر آشپزی می‌کند، چند نفر همزمان از فضا استفاده می‌کنند و آشپزخانه تا چه اندازه بخشی از فضای اجتماعی خانه است. پلان خوب پاسخی مستقیم به همین رفتارهاست.",
    },
    {
      type: "pull",
      label: "REDORA NOTE",
      text: "اگر پلان حرکت شما را ساده نکند، زیباترین متریال‌ها هم مشکل اصلی را حل نمی‌کنند.",
    },
    { type: "heading", id: "island", text: "02. جزیره؛ عنصر زیبا یا ابزار واقعی؟" },
    {
      type: "paragraph",
      text: "جزیره فقط یک حجم مرکزی نیست. فاصله آن تا کابینت‌ها، محل نشستن، سینک یا اجاق و حتی جهت باز شدن درها باید همزمان دیده شوند. گاهی حذف جزیره، تصمیم حرفه‌ای‌تری از اضافه کردن آن است.",
    },
    {
      type: "figure",
      image: "light",
      organic: true,
      caption: "فضای روشن با جزیره‌ای که هم سطح کار است و هم نقطه جمع شدن خانواده.",
    },
    { type: "heading", id: "material", text: "03. متریال را برای زندگی واقعی انتخاب کنید" },
    {
      type: "paragraph",
      text: "سطحی که در رندر زیباست الزاماً برای استفاده روزمره مناسب نیست. مقاومت، نگهداری، لمس و نحوه پیرشدن متریال به اندازه ظاهر اولیه اهمیت دارند.",
    },
    {
      type: "checklist",
      title: "سه سؤال قبل از انتخاب متریال",
      items: [
        "آیا در برابر استفاده روزانه مقاوم است؟",
        "در نور واقعی خانه چه رنگی دیده می‌شود؟",
        "بعد از چند سال هنوز کیفیت بصری دارد؟",
      ],
    },
    { type: "heading", id: "light", text: "04. نور را به آخر پروژه موکول نکنید" },
    {
      type: "paragraph",
      text: "نور عمومی، نور سطح کار و نور دکوراتیو سه نقش متفاوت دارند. طراحی حرفه‌ای از ابتدا جای هر سه را مشخص می‌کند تا فضا در شب همان‌قدر خوب باشد که در روز.",
    },
    {
      type: "figure",
      image: "dark",
      caption: "ترکیب نور خطی و آویز برای ایجاد عمق در متریال‌های تیره.",
    },
    { type: "heading", id: "storage", text: "05. هر چیزی باید جای مشخص خودش را داشته باشد" },
    {
      type: "paragraph",
      text: "به جای افزایش بی‌هدف تعداد کابینت‌ها، وسایل واقعی را دسته‌بندی کنید. ذخیره‌سازی زمانی موفق است که دسترسی سریع و نظم طبیعی ایجاد کند.",
    },
    {
      type: "quote",
      text: "آشپزخانه خوب قرار نیست فقط در روز عکاسی مرتب باشد؛ باید در یک سه‌شنبه شلوغ هم درست کار کند.",
    },
  ],
  tags: "طراحی · راهنما · آشپزخانه",
  /*
   * On the reference all three cards link to /blog/kitchen-trends, which returns 404.
   * Each card is pointed at the published article its title describes instead.
   */
  related: [
    { slug: "warm-dark-kitchen", image: "dark", tag: "متریال", title: "چطور آشپزخانه تیره را گرم کنیم؟" },
    {
      slug: "island-dimensions",
      image: "light",
      tag: "راهنما",
      title: "ابعاد استاندارد برای یک جزیره کاربردی",
    },
    { slug: "kitchen-2026", image: "hero", tag: "ترند", title: "آشپزخانه ۲۰۲۶؛ آرام‌تر و دقیق‌تر" },
  ],
};

/** Order matches the reference archive: the featured article, then the grid. */
export const articles: readonly Article[] = [
  {
    slug: "kitchen-decisions",
    title: "۷ تصمیمی که قبل از طراحی آشپزخانه باید بگیرید",
    excerpt: "یک راهنمای کاربردی برای پلان، نور، متریال و جزئیات قبل از شروع پروژه.",
    category: "design",
    categoryLabel: "طراحی آشپزخانه",
    minutes: null,
    cover: "hero",
    layout: "default",
    featured: true,
    body: kitchenDecisionsBody,
  },
  {
    slug: "island-stone",
    title: "سنگ روشن یا تیره؟ انتخاب سطح مناسب برای جزیره",
    excerpt: "مقایسه حس فضا، نگهداری و هماهنگی متریال‌ها در آشپزخانه.",
    category: "material",
    categoryLabel: "متریال",
    minutes: 6,
    cover: "light",
    layout: "tall",
    body: kitchenDecisionsBody,
  },
  {
    slug: "warm-dark-kitchen",
    title: "چطور آشپزخانه تیره را گرم و دعوت‌کننده کنیم؟",
    excerpt: "تعادل میان چوب، نور و سطوح تیره بدون سنگین شدن فضا.",
    category: "design",
    categoryLabel: "طراحی",
    minutes: 5,
    cover: "dark",
    layout: "default",
    body: kitchenDecisionsBody,
  },
  {
    slug: "kitchen-2026",
    title: "آشپزخانه ۲۰۲۶؛ کمتر نمایش بده، بهتر طراحی کن",
    excerpt:
      "چرا فضاهای آرام، ذخیره‌سازی پنهان و متریال‌های طبیعی جای طراحی‌های شلوغ را گرفته‌اند.",
    category: "trend",
    categoryLabel: "ترند و ایده",
    minutes: 8,
    cover: "hero",
    layout: "wide",
    body: kitchenDecisionsBody,
  },
  {
    slug: "island-dimensions",
    title: "ارتفاع، فاصله و ابعاد استاندارد در طراحی جزیره",
    excerpt: "اعدادی که تجربه استفاده از آشپزخانه را تغییر می‌دهند.",
    category: "guide",
    categoryLabel: "راهنما",
    minutes: 4,
    cover: "light",
    layout: "default",
    body: kitchenDecisionsBody,
  },
  {
    slug: "natural-wood",
    title: "چوب طبیعی در آشپزخانه مدرن؛ کجا و چقدر؟",
    excerpt: "استفاده کنترل‌شده از بافت چوب برای ساختن گرما و عمق.",
    category: "material",
    categoryLabel: "متریال",
    minutes: 7,
    cover: "dark",
    layout: "default",
    body: kitchenDecisionsBody,
  },
];

export const featuredArticle: Article = articles.find((article) => article.featured) ?? articles[0];

export const archiveArticles: readonly Article[] = articles.filter((article) => !article.featured);

export function getArticle(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}
