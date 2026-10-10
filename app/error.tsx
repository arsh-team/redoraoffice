"use client";

import Link from "next/link";
import { useEffect } from "react";
import { StatusPage } from "@/components/layout/StatusPage";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/** Route-level error boundary. Details go to the console only; visitors never see a stack trace. */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <StatusPage
      eyebrow="SOMETHING WENT WRONG"
      title="مشکلی پیش آمد."
      description="بارگذاری این صفحه با خطا روبه‌رو شد. لطفاً دوباره تلاش کنید؛ اگر مشکل ادامه داشت از صفحه اصلی ادامه دهید."
    >
      <button className="btn" type="button" onClick={reset}>
        تلاش دوباره ←
      </button>
      <Link className="ghostBtn" href="/">
        صفحه اصلی
      </Link>
    </StatusPage>
  );
}
