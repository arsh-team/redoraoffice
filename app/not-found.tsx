import type { Metadata } from "next";
import Link from "next/link";
import { StatusPage } from "@/components/layout/StatusPage";

export const metadata: Metadata = {
  title: "صفحه پیدا نشد",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <StatusPage
      eyebrow="ERROR 404"
      title="این صفحه پیدا نشد."
      description="نشانی واردشده وجود ندارد یا جابه‌جا شده است. از صفحه اصلی یا نمونه‌کارها ادامه دهید."
    >
      <Link className="btn" href="/">
        بازگشت به صفحه اصلی ←
      </Link>
      <Link className="ghostBtn" href="/projects">
        مشاهده پروژه‌ها
      </Link>
    </StatusPage>
  );
}
