import type { ImageKey } from "./images";

/** Services page collections, transcribed from https://redoraoffice.ir/services. */

export interface Service {
  number: string;
  /** English discipline label printed above the title. */
  label: string;
  icon: string;
  title: string;
  text: string;
  image: ImageKey;
  tone: "light" | "dark";
  /** Shape modifier of the tile's image mask. */
  shape: "curve-right" | "curve-left" | "split-soft" | "split-angle";
}

export const services: readonly Service[] = [
  {
    number: "01.",
    label: "KITCHEN DESIGN",
    icon: "⌘",
    title: "طراحی کامل آشپزخانه",
    text: "طراحی اختصاصی آشپزخانه بر اساس سبک زندگی، فضای موجود و سلیقه شما؛ از کانسپت و پلان تا جزئیات نهایی.",
    image: "hero",
    tone: "light",
    shape: "curve-right",
  },
  {
    number: "02.",
    label: "CUSTOM CABINETRY",
    icon: "▦",
    title: "کابینت سفارشی",
    text: "طراحی و ساخت کابینت مدرن با متریال باکیفیت، تناسبات دقیق و جزئیاتی که برای هر پروژه اختصاصی هستند.",
    image: "dark",
    tone: "dark",
    shape: "curve-left",
  },
  {
    number: "03.",
    label: "MATERIAL SELECTION",
    icon: "◇",
    title: "انتخاب متریال و پالت رنگ",
    text: "انتخاب و هماهنگی سنگ، چوب، فلز، رنگ و بافت برای ساخت یک هویت بصری منسجم و ماندگار.",
    image: "light",
    tone: "light",
    shape: "split-soft",
  },
  {
    number: "04.",
    label: "SPACE PLANNING",
    icon: "▤",
    title: "برنامه‌ریزی فضا",
    text: "تحلیل حرکت، دسترسی، ارگونومی و جانمایی برای تبدیل فضای موجود به آشپزخانه‌ای کاربردی و زیبا.",
    image: "dark",
    tone: "dark",
    shape: "split-angle",
  },
  {
    number: "05.",
    label: "LIGHTING & DETAILS",
    icon: "◯",
    title: "نورپردازی و جزئیات",
    text: "طراحی نور و انتخاب جزئیات تکمیلی برای خلق فضایی گرم، آرام و هماهنگ با معماری پروژه.",
    image: "light",
    tone: "light",
    shape: "curve-left",
  },
  {
    number: "06.",
    label: "APPLIANCE INTEGRATION",
    icon: "▣",
    title: "انتخاب و جانمایی لوازم",
    text: "مشاوره برای انتخاب لوازم و جانمایی هوشمند آن‌ها با هدف هماهنگی کامل عملکرد و طراحی.",
    image: "hero",
    tone: "dark",
    shape: "curve-right",
  },
  {
    number: "07.",
    label: "RENOVATION & EXECUTION",
    icon: "✦",
    title: "بازسازی و اجرا",
    text: "اجرای دقیق و اصولی با تیم متخصص، برنامه زمان‌بندی مشخص و کنترل کیفیت از شروع تا تحویل.",
    image: "light",
    tone: "light",
    shape: "split-angle",
  },
  {
    number: "08.",
    label: "AFTER-SALES SERVICE",
    icon: "◎",
    title: "پشتیبانی پس از اجرا",
    text: "همراهی Redora پس از تحویل برای حفظ کیفیت، عملکرد و تجربه مطلوب آشپزخانه در طول زمان.",
    image: "dark",
    tone: "light",
    shape: "curve-right",
  },
];

export const serviceHighlights: readonly { number: string; label: string }[] = [
  { number: "01", label: "طراحی اختصاصی" },
  { number: "02", label: "انتخاب متریال" },
  { number: "03", label: "اجرا و نظارت" },
];

export const materialSwatches: readonly { key: "stone" | "wood" | "metal"; label: string; name: string }[] = [
  { key: "stone", label: "سنگ", name: "سنگ طبیعی" },
  { key: "wood", label: "چوب", name: "چوب گرم" },
  { key: "metal", label: "فلز", name: "فلز مات" },
];

export const deliverables: readonly { number: string; title: string; text: string }[] = [
  { number: "01", title: "پلان و جانمایی", text: "چیدمان عملکردی، مسیر حرکت و ابعاد اصلی." },
  { number: "02", title: "طراحی سه‌بعدی", text: "تصویر دقیق فضا پیش از شروع اجرا." },
  { number: "03", title: "پالت متریال", text: "انتخاب و هماهنگی تمام سطوح و بافت‌ها." },
  { number: "04", title: "نقشه‌های اجرایی", text: "جزئیات لازم برای ساخت و اجرای دقیق." },
];

export const serviceProcess: readonly { number: string; title: string; text: string }[] = [
  { number: "01", title: "شناخت و مشاوره", text: "نیازها، سلیقه، بودجه و محدودیت‌های پروژه." },
  { number: "02", title: "کانسپت و طراحی", text: "پلان، فرم، متریال و تصویر سه‌بعدی." },
  { number: "03", title: "جزئیات و اجرا", text: "نقشه‌های اجرایی، نظارت و کنترل کیفیت." },
  { number: "04", title: "تحویل نهایی", text: "فضایی کامل، هماهنگ و آماده زندگی." },
];

export const serviceFaqs: readonly { question: string; answer: string }[] = [
  {
    question: "آیا فقط طراحی انجام می‌دهید یا اجرا هم دارید؟",
    answer: "هر دو مسیر قابل ارائه است؛ طراحی مستقل یا طراحی به همراه هماهنگی و نظارت اجرایی.",
  },
  {
    question: "طراحی سه‌بعدی در خدمات وجود دارد؟",
    answer: "بله، در پکیج طراحی کامل، تصاویر سه‌بعدی برای تصمیم‌گیری دقیق‌تر ارائه می‌شود.",
  },
  {
    question: "برای بازسازی آشپزخانه قدیمی هم می‌توانم اقدام کنم؟",
    answer: "بله، نوسازی یکی از خدمات اصلی Redora است و بر اساس وضعیت موجود طراحی می‌شود.",
  },
];
