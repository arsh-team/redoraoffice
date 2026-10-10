import type { ImageKey } from "./images";

/** Contact page collections, transcribed from https://redoraoffice.ir/contact. */

export const briefProjectTypes: readonly { value: string; hint: string }[] = [
  { value: "طراحی کامل", hint: "از کانسپت تا نقشه‌های اجرایی" },
  { value: "بازطراحی", hint: "تغییر آشپزخانه موجود" },
  { value: "طراحی سه‌بعدی", hint: "کانسپت و تصویرسازی فضا" },
  { value: "مشاوره متریال", hint: "رنگ، سنگ، چوب و جزئیات" },
];

export const briefStyles: readonly { value: string; image: ImageKey }[] = [
  { value: "روشن و مینیمال", image: "light" },
  { value: "گرم و طبیعی", image: "hero" },
  { value: "تیره و معاصر", image: "dark" },
];

export const briefSpaceStatuses = ["ساختمان در حال ساخت", "فضای موجود", "در حال بازسازی"] as const;

export const briefBudgets: readonly { value: string; hint: string }[] = [
  { value: "اقتصادی", hint: "اولویت با کنترل هزینه" },
  { value: "استاندارد", hint: "تعادل کیفیت و هزینه" },
  { value: "پریمیوم", hint: "متریال و جزئیات سطح بالا" },
];

export const briefTimelines = [
  "در اولین فرصت",
  "۱ تا ۳ ماه آینده",
  "۳ تا ۶ ماه آینده",
  "فعلاً در مرحله بررسی هستم",
] as const;

export const contactSteps: readonly { number: string; title: string; text: string }[] = [
  { number: "01", title: "جلسه اولیه", text: "شناخت نیازها، سبک زندگی، بودجه و محدودیت‌های پروژه." },
  {
    number: "02",
    title: "بررسی و پیشنهاد",
    text: "تیم طراحی محدوده خدمات و مسیر مناسب پروژه را پیشنهاد می‌دهد.",
  },
  {
    number: "03",
    title: "شروع طراحی",
    text: "پس از توافق، کانسپت و طراحی پروژه وارد فاز اجرایی می‌شود.",
  },
];

export const contactFaqs: readonly { question: string; answer: string }[] = [
  {
    question: "جلسه اولیه حضوری است یا آنلاین؟",
    answer: "بسته به شرایط پروژه، جلسه اولیه می‌تواند حضوری یا آنلاین برگزار شود.",
  },
  {
    question: "برای شروع چه مدارکی لازم است؟",
    answer: "پلان موجود، ابعاد تقریبی و چند تصویر از فضای فعلی برای شروع بررسی بسیار کمک‌کننده است.",
  },
  {
    question: "آیا فقط طراحی انجام می‌دهید؟",
    answer:
      "نوع همکاری بر اساس پروژه مشخص می‌شود و می‌تواند از مشاوره و طراحی تا همراهی در انتخاب متریال ادامه پیدا کند.",
  },
];
