/** About page collections, transcribed from https://redoraoffice.ir/about. */

export const storyPills = ["نور و ریتم روزانه", "عادت‌های زندگی", "متریال و لمس"] as const;

export const aboutNumbers: readonly { value: string; label: string }[] = [
  { value: "120+", label: "پروژه طراحی‌شده" },
  { value: "8+", label: "سال تجربه" },
  { value: "100%", label: "طراحی اختصاصی" },
  { value: "01", label: "نگاه یکپارچه از ایده تا اجرا" },
];

export const designValues: readonly { number: string; title: string; text: string }[] = [
  {
    number: "01",
    title: "عملکرد قبل از تزئین",
    text: "مسیر حرکت، دسترسی و ارگونومی پایه تصمیم‌های طراحی‌اند.",
  },
  {
    number: "02",
    title: "جزئیات آرام",
    text: "اتصال‌ها، نور و بافت‌ها بدون شلوغی، کیفیت فضا را تعریف می‌کنند.",
  },
  {
    number: "03",
    title: "متریال صادق",
    text: "سنگ، چوب و فلز را بر اساس کیفیت واقعی و نحوه پیرشدن انتخاب می‌کنیم.",
  },
  { number: "04", title: "هویت شخصی", text: "هیچ پروژه‌ای نسخه تکراری پروژه قبلی نیست." },
];

export const journey: readonly { number: string; title: string; text: string }[] = [
  { number: "01", title: "شروع نگاه Redora", text: "تمرکز تخصصی روی طراحی آشپزخانه و فضای زندگی." },
  { number: "02", title: "توسعه طراحی سه‌بعدی", text: "تصمیم‌گیری دقیق‌تر پیش از ورود به اجرا." },
  { number: "03", title: "شبکه متریال و اجرا", text: "هماهنگی بهتر بین ایده، تامین و ساخت." },
  { number: "04", title: "امروز", text: "طراحی یکپارچه با تمرکز بر تجربه شخصی هر کارفرما." },
];
